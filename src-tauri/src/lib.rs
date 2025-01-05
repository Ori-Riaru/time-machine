use tauri::{path::BaseDirectory, Manager};
use wallpaper;

#[tauri::command]
fn set_wallpaper(handle: tauri::AppHandle, path: &str) {
    let absolute_path = handle
        .path()
        .resolve("wallpapers/".to_string() + path, BaseDirectory::Resource)
        .unwrap();

    wallpaper::set_mode(wallpaper::Mode::Crop).expect("failed to set wallpaper mode");
    wallpaper::set_from_path(&absolute_path.to_string_lossy()).expect("failed to set wallpaper");
}

use chrono::NaiveDate;
use rand::seq::SliceRandom;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::fs;

#[derive(Serialize, Deserialize)]
struct Time {
    year: i32,
    month: u32,
    day: u32,
    era: String,
}

#[derive(Serialize, Deserialize)]
struct Location {
    latitude: f64,
    longitude: f64,
}

#[derive(Serialize, Deserialize)]
struct Event {
    event: String,
    description: String,
    time: Time,
    location: Location,
    wallpapers: Vec<String>,
}

#[derive(Serialize, Deserialize)]
struct EventDatabase {
    wallpapers: Vec<Event>,
}

fn parse_era_year(year: i32, era: &str) -> i32 {
    match era.to_uppercase().as_str() {
        "BCE" | "BC" => -year,
        _ => year,
    }
}

fn calculate_temporal_distance(target: &Time, event: &Time) -> i32 {
    let target_year = parse_era_year(target.year, &target.era);
    let event_year = parse_era_year(event.year, &event.era);

    let target_date =
        NaiveDate::from_ymd_opt(target_year, target.month, target.day).unwrap_or_default();

    let event_date =
        NaiveDate::from_ymd_opt(event_year, event.month, event.day).unwrap_or_default();

    (target_date - event_date).num_days() as i32
}

fn calculate_spatial_distance(target_lat: f64, target_lon: f64, event: &Location) -> f64 {
    let r = 6371.0;

    let lat1 = target_lat.to_radians();
    let lat2 = event.latitude.to_radians();
    let delta_lat = (event.latitude - target_lat).to_radians();
    let delta_lon = (event.longitude - target_lon).to_radians();

    let a =
        (delta_lat / 2.0).sin().powi(2) + lat1.cos() * lat2.cos() * (delta_lon / 2.0).sin().powi(2);
    let c = 2.0 * a.sqrt().asin();

    r * c
}

#[tauri::command]
fn find_event(
    handle: tauri::AppHandle,
    year: &str,
    month: &str,
    day: &str,
    era: &str,
    longitude: &str,
    latitude: &str,
    sqwimble: &str,
    deterministic: &str,
) -> String {
    // Parse input parameters
    let target_year = year.parse::<i32>().unwrap_or(2024);
    let target_month = month.parse::<u32>().unwrap_or(1);
    let target_day = day.parse::<u32>().unwrap_or(1);
    let target_lon = longitude.parse::<f64>().unwrap_or(0.0);
    let target_lat = latitude.parse::<f64>().unwrap_or(0.0);
    let sqwimble_range = sqwimble.parse::<i32>().unwrap_or(100);
    let is_deterministic = deterministic.parse::<bool>().unwrap_or(true);

    // Load and parse the events database
    let resource_path = handle
        .path()
        .resolve("wallpapers/index.json", BaseDirectory::Resource)
        .expect("failed to resolve resource");

    let db_content = fs::read_to_string(resource_path).expect("failed to read database file");

    let db: EventDatabase = serde_json::from_str(&db_content).expect("failed to parse database");

    let target = Time {
        year: target_year,
        month: target_month,
        day: target_day,
        era: era.to_string(),
    };

    // Find valid events within temporal range
    let mut valid_events: Vec<(&Event, i32, f64)> = db
        .wallpapers
        .iter()
        .map(|event| {
            let temporal_dist = calculate_temporal_distance(&target, &event.time);
            let spatial_dist = calculate_spatial_distance(target_lat, target_lon, &event.location);
            (event, temporal_dist.abs(), spatial_dist)
        })
        .filter(|(_, temp_dist, _)| *temp_dist <= sqwimble_range * 365)
        .collect();

    // If no events within range, find the closest one
    if valid_events.is_empty() {
        valid_events = db
            .wallpapers
            .iter()
            .map(|event| {
                let temporal_dist = calculate_temporal_distance(&target, &event.time);
                let spatial_dist =
                    calculate_spatial_distance(target_lat, target_lon, &event.location);
                (event, temporal_dist.abs(), spatial_dist)
            })
            .min_by(|a, b| a.1.partial_cmp(&b.1).unwrap_or(std::cmp::Ordering::Equal))
            .into_iter()
            .collect();
    }

    // Select the event based on deterministic flag
    let selected_event = if is_deterministic {
        // Sort by spatial distance and take the closest
        valid_events.sort_by(|a, b| a.2.partial_cmp(&b.2).unwrap_or(std::cmp::Ordering::Equal));
        valid_events.first()
    } else {
        // Choose a random event from valid ones
        valid_events.choose(&mut rand::thread_rng())
    };

    // Format the response
    if let Some((event, _, _)) = selected_event {
        json!({
            "path": event.wallpapers.choose(&mut rand::thread_rng()),
            "event": event.event,
            "description": event.description,
            "time": event.time,
            "location": event.location,
        })
        .to_string()
    } else {
        "{}".to_string()
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![set_wallpaper, find_event])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

{
  inputs = {
    nixpkgs.url = "nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};

      libraries = with pkgs; [
        webkitgtk
        gtk3
        cairo
        gdk-pixbuf
        glib
        dbus
        openssl
        librsvg
      ];

      packages = with pkgs; [
        webkitgtk_4_1
        curl
        wget
        pkg-config
        dbus
        openssl
        glib
        gtk3
        libsoup_3
        webkitgtk
        librsvg
        nodejs
        rustc
        cargo
        cargo-tauri
      ];
    in {
      devShell = pkgs.mkShell {
        buildInputs = packages;

        shellHook = ''
          export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath libraries}:$LD_LIBRARY_PATH
          export XDG_DATA_DIRS=${pkgs.gsettings-desktop-schemas}/share/gsettings-schemas/${pkgs.gsettings-desktop-schemas.name}:${pkgs.gtk3}/share/gsettings-schemas/${pkgs.gtk3.name}:$XDG_DATA_DIRS
        '';
      };
    });
}

{ nixpkgs ? (import <nixpkgs> {})
}:

let
  custompkgs = import <custompkgs> {};
  pkgs = (nixpkgs // custompkgs);
in
pkgs.mkShell rec {
  buildInputs = with pkgs; [
    tree-sitter
    graphviz
  ];
}

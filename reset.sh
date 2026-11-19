#!/bin/sh
# Deja la base como al principio (esquema + datos de prueba). La app puede seguir corriendo.
# UCD_DIR: carpeta del repo de UCD (por defecto ~/Proyectos/UCD).
UCD_DIR="${UCD_DIR:-$HOME/Proyectos/UCD}"
cd "$UCD_DIR" && dotnet ef database drop -f --project src/UCD.DataAccess --startup-project src/UCD.WebApp >/dev/null 2>&1
dotnet ef database update --project src/UCD.DataAccess --startup-project src/UCD.WebApp >/dev/null 2>&1
cd - >/dev/null && UCD_DIR="$UCD_DIR" node cargar-datos.js

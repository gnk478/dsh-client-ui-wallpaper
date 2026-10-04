#!/bin/bash
# 从 Dynamic Wallpaper.app 的播放列表同步素材到 DSH 壁纸模块
#   ./sync-wallpaper-playlist.sh          只同步播放列表里的视频
#   ./sync-wallpaper-playlist.sh --stills 连静态壁纸目录一起同步
#   ./sync-wallpaper-playlist.sh --dry    只看会同步什么，不复制
set -u

APP_HOME="$HOME/Library/Containers/whbalzac.Dongtaizhuomian/Data/Documents"
PREFS="$APP_HOME/Setting/Preferences.json"
VIDEO_SRC="$APP_HOME/Videos"
WALLPAPER_SRC="$APP_HOME/Wallpaper"
VIDEO_DST="$HOME/.dsh/videos"
WALLPAPER_DST="$HOME/.dsh/wallpapers"

STILLS=0
DRY=0
for arg in "$@"; do
  case "$arg" in
    --stills) STILLS=1 ;;
    --dry) DRY=1 ;;
    *) echo "unknown flag: $arg" >&2; exit 2 ;;
  esac
done

[ -f "$PREFS" ] || { echo "找不到 app 设置：$PREFS" >&2; exit 1; }
mkdir -p "$VIDEO_DST" "$WALLPAPER_DST"

added_video=0
added_still=0
skipped=0
missing=0

echo "== 播放列表视频 =="
SKIP_FILE="$HOME/.dsh/wallpaper-sync-skip.txt"
skip_name() { [ -f "$SKIP_FILE" ] && grep -qxF "$1" "$SKIP_FILE"; }

while IFS= read -r name; do
  [ -n "$name" ] || continue
  [ -n "$name" ] || continue
  if skip_name "$name"; then skipped=$((skipped + 1)); continue; fi
  src="$VIDEO_SRC/$name"
  dst="$VIDEO_DST/$name"
  if [ ! -f "$src" ]; then
    echo "  ! 素材缺失（app 里也没有）：$name"
    missing=$((missing + 1))
    continue
  fi
  if [ -f "$dst" ]; then
    skipped=$((skipped + 1))
    continue
  fi
  if [ "$DRY" = "1" ]; then
    echo "  + 将导入 $name ($(du -h "$src" | cut -f1))"
  else
    cp -p "$src" "$dst" && echo "  + 已导入 $name ($(du -h "$dst" | cut -f1))"
  fi
  added_video=$((added_video + 1))
done < <(/usr/bin/python3 -c "
import json,sys
d=json.load(open('$PREFS'))
for n in d.get('playlist_array') or []: print(n)
")

if [ "$STILLS" = "1" ]; then
  echo "== 静态壁纸 =="
  for src in "$WALLPAPER_SRC"/*; do
    [ -f "$src" ] || continue
    name=$(basename "$src")
    dst="$WALLPAPER_DST/$name"
    if [ -f "$dst" ]; then skipped=$((skipped + 1)); continue; fi
    if [ "$DRY" = "1" ]; then
      echo "  + 将导入 $name"
    else
      cp -p "$src" "$dst" && echo "  + 已导入 $name"
    fi
    added_still=$((added_still + 1))
  done
fi

echo
echo "完成：新增视频 ${added_video} 段、新增静态图 ${added_still} 张；已存在跳过 ${skipped}，缺失 ${missing}"
if [ "$DRY" = "0" ] && [ $((added_video + added_still)) -gt 0 ]; then
  echo "（壁纸模块会自动扫描并把这些新素材加入轮换）"
fi

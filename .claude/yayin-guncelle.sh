#!/bin/sh
# build/ altında bir dosya değişince yayin/ ve takder-yayin.zip'i yeniden üretir.
f=$(jq -r '.tool_input.file_path // .tool_response.filePath // empty')
case "$f" in
  */kttak/build/*) ;;
  *) exit 0 ;;
esac
cd "$CLAUDE_PROJECT_DIR" || exit 0
npm run -s yayina-hazirla >/dev/null 2>&1 && npm run -s paketle >/dev/null 2>&1 \
  && echo '{"systemMessage":"yayin/ ve takder-yayin.zip güncellendi"}'

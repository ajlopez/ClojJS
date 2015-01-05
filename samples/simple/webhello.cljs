
(def http (js/require "http"))

(def server (. http (createServer (fn [req res] (. res (end "Hello, world"))))))

(. server (listen 3000))

(. js/console (log "Listening port 3000"))


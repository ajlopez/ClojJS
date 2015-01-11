(ns web.server)(def http (js/require "http"))(defn handler [request]    { :status 200        :headers { "Content-type" "text/html" }        :body "Hello World" })        (defn process [req res handler]    (let [response (handler req)]        (set! (. res statusCode) (get response :status 200))        (.setHeader res ("Content-type" "text/html"))        (.end res ((get response :body "")))))        (defn run [handler port]    (.listen (.createServer http ((fn [req res] (process req res handler)))) (port))    (println "Server listening at port " port))    (run handler 3000)
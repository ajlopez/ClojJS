(ns tests.loop)(defn recur?    [value]    (.isRecur js/recurs (value)))    (is (recur? (recur 1 2)))(let [result (recur 1 2 3)]    (is (= (.length result ()) 3))
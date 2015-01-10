(ns cljs.core)

(def defmacro (fn [name & fdecl]
	`(do 
        (def ~name (fn ~@fdecl))
        (set! (. ~name macro) true))))

(set! (. defmacro macro) true)

(defmacro defn [name & fdecl]
	`(def ~name (fn ~@fdecl))
)

(defn second [x] (first (next x)))

(defn ffirst [x] (first (first x)))

(defn nfirst [x] (next (first x)))

(defn fnext [x] (first (next x)))

(defn nnext [x] (next (next x)))

(defmacro println [& args]
    `(js/console.log (str ~@args))
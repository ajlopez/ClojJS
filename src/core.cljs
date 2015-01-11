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
    `(.log js/console ((str ~@args))))
    
(defmacro is [cond]
    `(if ~cond
            true
            (throw (Error. (str "Assert error: " '~cond " is not true")))))

(defn not [x]
    (if x false true))
    
(defmacro or
    ([] nil)
    ([x] x)
    ([x & next]
        `(let [$or ~x]
            (if $or $or (or ~@next)))))

(defmacro and
    ([] true)
    ([x] x)
    ([x & next]
        `(let [$and ~x]
            (if $and (and ~@next) $and))))
      
(defn false?
    [x] (=== x false))
  
(defn true?
    [x] (=== x true))

(defn nil?
    [x] (== x nil))
   
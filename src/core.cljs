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
            
(defmacro when
    [test & body]
    (list 'if test (cons 'do body)))
    
(defn not=
    [x y] (if (= x y) false true))
      
(defn false?
    [x] (=== x false))
  
(defn true?
    [x] (=== x true))

(defn nil?
    [x] (== x nil))

(defn some?
    [x] (not (nil? x)))

(defn symbol?
    [x] (.isSymbol js/symbols (x)))

(defn keyword?
    [x] (.isKeyword js/keywords (x)))

(defn vector?
    [x] (.isVector js/vectors (x)))

(defn map?
    [x] (.isMap js/maps (x)))

(defn array?
    [x] (.isArray js/Array (x)))

(defn get
    ([map key] (.get map (key)))
    ([map key missing] (if (.has map (key))
                            (.get map (key))
                            missing)))

(defn to-object
    [value]
    (if (nil? value)
        (Object.)
        (.asObject value ())))

(defn to-array
    [value]
    (if (nil? value)
        (Array.)
        (.asArray value ())))
        
(defn recur
    [& values]
    (.create js/recurs ((to-array values))))
        
(defn seq?
    [value]
    (and (!= (. value first) nil) (!= (. value next) nil) (!= (. value rest) nil)))

(defmacro ->
    [x & forms]
    (loop [x x, forms forms]
        (if forms
            (let [form (first forms)
                threaded (if (seq? form)
                           `(~(first form) ~x ~@(next form))
                           (list form x))]
            (recur threaded (next forms)))
          x)))

(defn inc [x] (+ x 1))

(defn dec [x] (- x 1))

(defn pos? [x] (> x 0))

(defmacro lazy-seq
    [& body]
    `(.create js/lazyseqs ((fn [] ~@body))))

(defn iterate
    [f x] (cons x (lazy-seq (iterate f (f x)))))

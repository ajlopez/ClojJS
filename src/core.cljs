(ns cljs.core)

(def defmacro (fn 

"Like defn, but the resulting function name is declared as a
macro and will be used as a macro by the compiler when it is
called."

    [name & fdecl]
	`(do 
        (def ~name (fn ~@fdecl))
        (set! (. ~name macro) true))))

(set! (. defmacro macro) true)

(defmacro defn 

"Same as (def name (fn ([params* ] exprs*)+))."
    
    [name & fdecl]
	`(def ~name (fn ~@fdecl))
)

(defn second [x] (first (next x)))

(defn ffirst [x] (first (first x)))

(defn nfirst [x] (next (first x)))

(defn fnext [x] (first (next x)))

(defn nnext [x] (next (next x)))

(defmacro when
    [test & body]
    (list 'if test (cons 'do body)))

(defmacro when-not
    [test & body]
        (list 'if test nil (cons 'do body)))

(defmacro cond
    [& clauses]
    (when clauses
        (list 'if (first clauses)
            (if (next clauses)
                (second clauses)
                (throw (Error.
                         "cond requires an even number of forms")))
            (cons 'cond (next (next clauses))))))

(defn spread
    [arglist]
    (cond
        (nil? arglist) nil
        (nil? (next arglist)) (seq (first arglist))
        :else (cons (first arglist) (spread (next arglist)))))

(defn list*
    ([args] (seq args))
    ([a args] (cons a args))
    ([a b args] (cons a (cons b args)))
    ([a b c args] (cons a (cons b (cons c args))))
    ([a b c d & more]
        (cons a (cons b (cons c (cons d (spread more)))))))


(defmacro println [& args]
    `(.log js/console ((str ~@args))))
    
(defmacro is [cond]
    `(if ~cond
            true
            (throw (Error. (str "Assert error: " '~cond " is not true")))))

(defmacro is-not [cond]
    `(if ~cond
            (throw (Error. (str "Assert error: " '~cond " is not true")))
            true))
            
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

(defn set?
    [x] (.isSet js/sets (x)))

(defn array?
    [x] (.isArray js/Array (x)))

(defn list?
    [x] (.isList js/lists (x)))
    
(defn coll?
    [x] (or (map? x) (set? x) (list? x) (vector? x)))

(defn empty?
  "Returns true if coll has no items - same as (not (seq coll)).
  Please use the idiom (seq x) rather than (not (empty? x))"
  [coll] (not (seq coll)))
    
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

(defn count
    [x] (if (nil? x)
            0
            (.length x ())))

(defmacro assert-args
  [& pairs]
  `(do (when-not ~(first pairs)
         (throw (Error.
                  (str "requires " ~(second pairs)))))
     ~(let [more (nnext pairs)]
        (when more
          (list* `assert-args more)))))

(defmacro when-let
    [bindings & body]
    (assert-args
        (vector? bindings) "a vector for its binding"
        (= 2 (count bindings)) "exactly 2 forms in binding vector")
        (let [form (bindings 0) tst (bindings 1)]
            `(let [$temp ~tst]
                (when $temp
                    (let [~form $temp]
                    ~@body)))))

(defn take
    [n coll]
    (lazy-seq
        (when (pos? n) 
            (when-let [s (seq coll)]
                (cons (first s) (take (dec n) (rest s)))))))
                
(defn assoc
    [map & keyvalues]
    (.assoc map ((to-array keyvalues))))
    
(defn dissoc
  "dissoc[iate]. Returns a new map of the same (hashed/sorted) type,
  that does not contain a mapping for key(s)."
  [map & keys]
    (.dissoc map ((to-array keys))))

(defn apply
  "Applies fn f to the argument list formed by prepending intervening arguments to args."
  ([f args]
     (. f (apply nil (to-array (seq args)))))
  ([f x args]
     (. f (apply nil (to-array (list* x args)))))
  ([f x y args]
     (. f (apply nil (to-array (list* x y args)))))
  ([f x y z args]
     (. f (apply nil (to-array (list* x y z args)))))
  ([f a b c d & args]
     (. f (apply nil (to-array (cons a (cons b (cons c (cons d (spread args))))))))))
     
(defn keys
    [x] (if (nil? x) nil 
            (let [keys (.getKeys x ())]
                (if (= (.length keys) 0)
                    nil
                    (.create js/lists (keys))))))

(defn vals
    [x] (if (nil? x) nil 
            (let [vals (.getValues x ())]
                (if (= (.length vals) 0)
                    nil
                    (.create js/lists (vals))))))

(defn map
    [f coll]
    (let [s (seq coll)]
        (if (nil? s)
            nil
            (cons (f (first s)) (map f (rest s))))))
            

(defn not-empty
  "If coll is empty, returns nil, else coll"
  [coll] (when (seq coll) coll))
  
(defn empty?
  "Returns true if coll has no items - same as (not (seq coll)).
  Please use the idiom (seq x) rather than (not (empty? x))"
  [coll] (not (seq coll)))
  
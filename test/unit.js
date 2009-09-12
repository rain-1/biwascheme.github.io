//
// test/unit.js - unit tests of BiwaScheme
//

var BiwaScheme = BiwaScheme || {};

BiwaScheme.register_tests = function(){

// test main
function puts(){}
function scm_eval(str, func){
  return (new BiwaScheme.Interpreter).evaluate(str, func||new Function());
}
function ev(str, func){
  return expect((new BiwaScheme.Interpreter).evaluate(str, func||new Function()));
}
function ew(str, func){
  return expect(BiwaScheme.to_write((new BiwaScheme.Interpreter).evaluate(str, func||new Function())));
}

var Set = BiwaScheme.Set;
describe('Set', {
  'before each' : function(){
    s123 = new Set(1,2,3);
    s345 = new Set(3,4,5);
    s6 = new Set(6);
    s1_6 = new Set(1,2,3,4,5,6);
  },
  'initialize, equals' : function(){
    expect( s123.equals(new Set(1,2,3)) ).should_be_true();
    expect( s123.equals(new Set(1,2,3)) ).should_be_true(); //s1 should not destructed
  },
  'set_cons' : function(){
    expect( s123.set_cons(4).equals(new Set(1,2,3,4)) ).should_be_true();
  },
  'set_union' : function(){
    expect( s123.set_union(s345, s6).equals(s1_6) ).should_be_true();
  },
  'set_intersect' : function(){
    expect( s123.set_intersect(s345).equals(new Set(3)) ).should_be_true();
    expect( s345.set_intersect(s123).equals(new Set(3)) ).should_be_true();
  },
  'set_minus' : function(){
    expect( s1_6.set_minus(s123).equals(new Set(4,5,6)) ).should_be_true();
    expect( s1_6.equals(new Set(1,2,3,4,5,6)) ).should_be_true();
  },
  'add' : function(){
    var s = new Set(1,2,3);
    s.add(4);
    expect( s.equals(new Set(1,2,3,4)) ).should_be_true();
    s.add(4);
    expect( s.equals(new Set(1,2,3,4)) ).should_be_true();
  },
  'member' : function(){
    expect( s123.member(1) ).should_be_true();
    expect( s123.member(4) ).should_be_false();
  },
  'index' : function(){
    expect( s123.index(1) ).should_be(0);
    expect( s123.index(2) ).should_be(1);
    expect( s123.index(3) ).should_be(2);
    expect( s123.index(4) ).should_be_null();
  },
  'rindex' : function(){
    expect( s123.rindex(1) ).should_be(2);
    expect( s123.rindex(2) ).should_be(1);
    expect( s123.rindex(3) ).should_be(0);
    expect( s123.rindex(4) ).should_be_null();
  },
  'size' : function(){
    expect( s123.size() ).should_be(3);
    expect( s1_6.size() ).should_be(6);
  }

});

describe('utilities', {
  'to_write' : function(){
    with(BiwaScheme){
      expect( to_write(1) ).should_be("1");
      expect( to_write("") ).should_be("\"\"");
      expect( to_write("asdf") ).should_be("\"asdf\"");
      expect( to_write(new Pair(1, 
                       new Pair(2, 
                         nil))) ).should_be("(1 2)");
      expect( to_write(Sym("a")) ).should_be("a");
      expect( to_write(true) ).should_be("#t");
      expect( to_write(false) ).should_be("#f");
      expect( to_write(nil) ).should_be("()");
      expect( to_write(Infinity) ).should_be("+inf.0");
      expect( to_write(-Infinity) ).should_be("-inf.0");
      expect( to_write(NaN) ).should_be("+nan.0");
      expect( to_write(undefined) ).should_be("undefined");
      expect( to_write(undef) ).should_be("#<undef>");
      expect( to_write([1,2,3]) ).should_be("#(1 2 3)");
      expect( to_write([NaN,Infinity,undef]) ).should_be("#(+nan.0 +inf.0 #<undef>)");
      expect( to_write(Char.get("a")) ).should_be("#\\a");
    }
  },
  'to_display' : function(){
    with(BiwaScheme){
      expect( to_display("asdf") ).should_be("asdf");
      // todo: add test case for Char
      expect( to_display(Sym("a")) ).should_be("a");
      expect( to_display(Char.get("a")) ).should_be("a");
    }
  },
  'Array#to_list' : function(){
    expect( [1,2,3].to_list().to_write() ).should_be("(1 2 3)");
  },
  'reduce_cyclic_info' : function(){
    with(BiwaScheme){
      var known = [1,2,3,4], used = [false,true,false,true];
      expect( reduce_cyclic_info(known, used) ).should_be([2,4]);
    }
  },
  'find_cyclic' : function(){
    with(BiwaScheme){
      var obj = [1,2,3];
      obj.push(obj);
      var known = [obj], used = [false];
      find_cyclic(obj, known, used);
      expect( known[0] == obj ).should_be(true);
      expect( used ).should_be([true]);
    }
  },
  'write_ss' : function(){
    with(BiwaScheme){
      var obj = new Pair(nil, nil);
      obj.car = obj;
      obj.cdr = obj;
      expect( write_ss(obj) ).should_be("#0=(#0# . #0#)");

      var x = [1,2,3].to_list();
      obj = [x,x].to_list();
      expect( write_ss(obj) ).should_be("(#0=(1 2 3) #0#)");

      expect( write_ss(1) ).should_be("1");
      expect( write_ss("asdf") ).should_be("\"asdf\"");
      expect( write_ss(new Pair(1, 
                       new Pair(2, 
                         nil))) ).should_be("(1 2)");
      expect( write_ss(Sym("a")) ).should_be("a");
      expect( write_ss(true) ).should_be("#t");
      expect( write_ss(false) ).should_be("#f");
      expect( write_ss(nil) ).should_be("()");
      expect( write_ss(Infinity) ).should_be("+inf.0");
      expect( write_ss(-Infinity) ).should_be("-inf.0");
      expect( write_ss(NaN) ).should_be("+nan.0");
      expect( write_ss(undef) ).should_be("#<undef>");
      expect( write_ss([1,2,3]) ).should_be("#(1 2 3)");
      expect( write_ss([NaN,Infinity,undef]) ).should_be("#(+nan.0 +inf.0 #<undef>)");
    }
  }
});

describe('literal', {
  'number' : function() {
    ev("0").should_be(0);
    ev("1").should_be(1);
  },
  'string' : function() {
    ev("\"\"").should_be("");
    ev("\"a\"").should_be("a");
  },
  'bool' : function() {
    ev("#t").should_be(true);
    ev("#f").should_be(false);
  }
});

describe('basic', {
  'if #f' : function(){
    ev("(if #f 2 5)").should_be(5);
  },
  'if not #f' : function(){
    ev("(if (not #f) 2 5)").should_be(2);
  },
  'set!' : function(){
    ev("((lambda (x) (set! x 3) x) 4)").should_be(3);
    ev("(define x 1) (set! x 2)").should_be(BiwaScheme.undef);
  }
});

describe('composed',{
  'y combinator' : function(){
ev("(((lambda (f) ((lambda (proc) (f (lambda (arg) ((proc proc) arg)))) (lambda (proc) (f (lambda (arg) ((proc proc) arg)))))) (lambda (self) (lambda (ls) (if (null? ls) 0 (+ 1 (self (cdr ls))))))) '(1 2 3 4 5))").should_be(5);
  },
  'y combinator (tail recursive)' : function(){
ev("(((lambda (f) ((lambda (proc) (f (lambda (arg1 arg2) ((proc proc) arg1 arg2)))) (lambda (proc) (f (lambda (arg1 arg2) ((proc proc) arg1 arg2)))))) (lambda (self) (lambda (ls acc) (if (null? ls) acc (self (cdr ls) (+ 1 acc)))))) '(1 2 3 4 5) 0)").should_be(5);
  },
  'factorial' : function(){
    ev("(define (fact n) (if (= n 0) 1 (* n (fact (- n 1))))) (fact 5)").should_be(120);
  }
});

describe("closure and saved env", {
  'lambda' : function(){
    ev("((lambda (x) (car x)) '(5 6 7))").should_be(5);
    ev("((lambda (x y) ((lambda (z) (* (car z) (cdr z))) (cons x y))) 3 4)").should_be(12)
//(define (addN n) (lambda (a) (+ a n)))
//(prim-test "lambda" 5 (lambda ()  ((addN 2) 3)))
//(define add3 (addN 3))
//(prim-test "lambda" 9 (lambda ()  (add3 6)))
//
//(define count (let ((c 0)) (lambda () (set! c (+ c 1)) c)))
//(prim-test "lambda" 1 (lambda ()  (count)))
//(prim-test "lambda" 2 (lambda ()  (count)))
  }
})

describe('syntax expand', {
  'simple expand' : function(){
    ev("(and 1 2 3)").should_be(3);
  },
  'nested expand' : function(){
    ev("(and 1 (and 2 3) 4)").should_be(4); 
  },
  'define-macro' : function(){
    ev("(define-macro (foo x y) `(+ ,x ,y)) (foo 8 9)").should_be(17);
    ev("(define-macro (bar x . y) `(+ ,x ,@y)) (bar 8 9 10 11)").should_be(38);
    ev("(define-macro (baz . y) `(+ ,@y)) (baz 8 9 10 11)").should_be(38);
    ev("(define-macro (bazz . y) `(length ',y)) (bazz 8 9 10 11)").should_be(4);
  }
})

describe('syntaxes', {
  'implicit begin in lambda body' : function(){
    ev("((lambda () 1 2))").should_be(2);
  },
  'begin' : function(){
    ev("((lambda (x) (begin (set! x 3) (set! x 2) (+ 1 3) x)) 1)").should_be(2);
  },
  'simple define' : function(){
    ev("(define x 1) x").should_be(1);
  },
  'multiple define' : function(){
    ev("(define x 1) (define y 2) x").should_be(1);
  },
  'redefine' : function(){
    ev("(define x 1) (define x 2) x").should_be(2);
  },
  'define and set!' : function(){
    ev("(define x 1) (set! x 2) x").should_be(2);
  },
  'function define' : function(){
    ev("(define f (lambda (x) (+ x 2))) (f 3)").should_be(5);
  },
  'function define (short style)' : function(){
    ev("(define (f x) (+ x 2)) (f 3)").should_be(5);
  },
  'function define (multiple args)' : function(){
    ev("(define (f x y) x) (f 3 4)").should_be(3);
  },
  'function define (optional args)' : function(){
    ev("(define (f x y . z) z) (f 3 4 5 6)").should_be("(5 6)");
  },
  'function define (empty optional args)' : function(){
    ew("(define (f x y . z) z) (f 3 4)").should_be("()");
  },
  'lambda function (variable arguments)' : function(){
    ew("((lambda args args) 1 2)").should_be("(1 2)");
  },
  'lambda function (nested variable arguments)' : function(){
    ew("((lambda () ((lambda args args) 1 2)))").should_be("(1 2)");
  },
  'lambda function (optional args)' : function(){
    ev("((lambda (x y . z) z) 3 4 5 6)").should_be("(5 6)");
    ev("(apply (lambda (x y . z) z) '(3 4 5 6))").should_be("(5 6)");
  },
  'lambda function (empty optional args)' : function(){
    ew("((lambda (x y . z) z) 3 4)").should_be("()");
  },
  'let' : function(){
    ev("((lambda (a) (let ((x 5) (y 2)) (set! y 1) (- x y a))) 1)").should_be(3);
    ev("(let ((x 2) (y 3)) (* x y))").should_be(6);
    ev("(let ((x 2) (y 3)) (let ((x 7) (z (+ x y))) (* z x)))").should_be(35);
    ev("((lambda (x) (let ((f 9)) (let ((k 90)) (set! k 43) x))) 31)").should_be(31);
  },
  'let*' : function(){
    ev("(let* ((x 1) (y x)) y)").should_be(1);
    ev("(let ((x 2) (y 3)) (let* ((x 7) (z (+ x y))) (* z x)))").should_be(70);
  },
//  'named let' : function(){
//    ev("(let loop ((i 0) (x 0)) (if (= i 5) x (loop (+ i 1) (- x 1))))").should_be(-5);
//  },
  // TODO: more test for cond
  'cond' : function(){
    ev("(cond ((= 1 2) #f) ((= 2 2) #t) (else '()))").should_be_true();
  },
  'cond(else)' : function(){
    ew("(cond ((= 1 2) #f) ((= 2 3) #t) (else '()))").should_be("()");
  }
});

describe('regexp', {
  'string->regexp' : function(){
    ew('(string->regexp "asdf")').should_be("/asdf/");
  },
  'regexp?' : function(){
    ev('(regexp? (string->regexp "asdf"))').should_be(true);
    ev('(regexp? "asdf")').should_be(false);
  },
  'regexp->string' : function(){
    ev('(regexp->string (string->regexp "asdf"))').should_be("asdf");
  },
  'regexp-exec' : function(){
    ew('(regexp-exec (string->regexp "(s)d(f)") "sdf")').should_be('("sdf" "s" "f")');
    ew('(regexp-exec "(s)d(f)" "sdf")').should_be('("sdf" "s" "f")');
  }
})

//r6rs base library
//
describe('11.4 Expressions', {
//  //(quote)
//  'quote' : function(){
//(quote a)                             ⇒  a
//(quote #(a b c))             ⇒  #(a b c)
//(quote (+ 1 2))                       ⇒  (+ 1 2)
//'"abc"                       ⇒  "abc"
//'145932                      ⇒  145932
//'a                           ⇒  a
//'#(a b c)                   ⇒  #(a b c)
//'()                          ⇒  ()
//'(+ 1 2)                     ⇒  (+ 1 2)
//'(quote a)                   ⇒  (quote a)
//''a                          ⇒  (quote a)
//  },
//  //(lambda)
//(lambda (x) (+ x x))              ⇒  a procedure
//((lambda (x) (+ x x)) 4)          ⇒  8
//
//((lambda (x)
//   (define (p y)
//     (+ y 1))
//   (+ (p x) x))
// 5)         ⇒ 11
//
//(define reverse-subtract
//  (lambda (x y) (- y x)))
//(reverse-subtract 7 10)                 ⇒  3
//
//(define add4
//  (let ((x 4))
//    (lambda (y) (+ x y))))
//(add4 6)                                ⇒  10
//((lambda x x) 3 4 5 6)                  ⇒  (3 4 5 6)
//((lambda (x y . z) z)
// 3 4 5 6)                               ⇒  (5 6)
//  //(if)
//(if (> 3 2) 'yes 'no)                   ⇒  yes
//(if (> 2 3) 'yes 'no)                   ⇒  no
//(if (> 3 2)
//    (- 3 2)
//    (+ 3 2))                            ⇒  1
//  //(set!)
//(let ((x 2))
//  (+ x 1)
//  (set! x 4)
//  (+ x 1))         ⇒  5
  'cond' : function(){
    with(BiwaScheme){
      ev("(cond ((> 3 2) 'greater) ((< 3 2) 'less))").should_be(Sym("greater"));
      ev("(cond ((> 3 3) 'greater) ((< 3 3) 'less) (else 'equal))").should_be(Sym("equal"));
      ev("(cond ('(1 2 3) => cadr) (else #f))").should_be(2);
    }
  },
  'case' : function(){
    with(BiwaScheme){
      ev("(case (* 2 3) ((2 3 5 7) 'prime) ((1 4 6 8 9) 'composite))").should_be(Sym("composite"));
      // ev("(case (car '(c d)) ((a) 'a) ((b) 'b)) ⇒  unspecified
      ev("(case (car '(c d)) ((a e i o u) 'vowel) ((w y) 'semivowel) (else 'consonant))").should_be(Sym("consonant"));
    }
  },
  'and' : function(){
    ev("(and (= 2 2) (> 2 1))").should_be(true);
    ev("(and (= 2 2) (< 2 1))").should_be(false);
    ew("(and 1 2 'c '(f g))").should_be("(f g)");
    ev("(and)").should_be(true);
  },
  'or' : function(){
    ev("(or (= 2 2) (> 2 1))").should_be(true);
    ev("(or (= 2 2) (< 2 1))").should_be(true);
    ev("(or #f #f #f)").should_be(false);
    ew("(or '(b c) (/ 3 0))").should_be("(b c)");
    ev("(or)").should_be(false);
  },
  'let' : function(){
    ev("(let ((x 2) (y 3)) (* x y))").should_be(6);
    ev(" (let ((x 2) (y 3)) (let ((x 7) (z (+ x y))) (* z x)))").should_be(35);
  },
  'named let' : function(){
    ev("(let loop ((a 1)(b 3))" +
       "  (if (= a 0)" +
       "    b" +
       "    (loop (- a 1) (- b 1))))").should_be(2);
  },
  'let*' : function(){
    ev("(let ((x 2) (y 3)) (let* ((x 7) (z (+ x y))) (* z x))) ").should_be(70);
  },
  'letrec' : function(){
    ev(" (letrec ((even?  (lambda (n) (if (zero? n) #t (odd? (- n 1))))) (odd?  (lambda (n) (if (zero? n) #f (even? (- n 1)))))) (even? 88))   ").should_be(true);
  },
//  'letrec*' : function(){
//    ev(" (letrec* ((p (lambda (x) (+ 1 (q (- x 1))))) (q (lambda (y) (if (zero? y) 0 (+ 1 (p (- y 1)))))) (x (p 5)) (y x)) y)").should_be(5);
//  }
  'let-values' : function(){
    ew("(let-values (((a b) (values 1 2)) " +
       "             ((c d) (values 3 4)))" +
       "  (list a b c d))                 ").should_be("(1 2 3 4)");
    ew("(let-values (((a b . c) (values 1 2 3 4)))" +
       "  (list a b c))                   ").should_be("(1 2 (3 4))");
//    ew("(let ((a 'a) (b 'b) (x 'x) (y 'y))  " +
//       "  (let-values (((a b) (values x y)) " +
//       "               ((x y) (values a b)))" +
//       "    (list a b x y)))                ").should_be("(x y a b)");
  }
//
//  //(let*-values)
//(let ((a 'a) (b 'b) (x 'x) (y 'y))
//  (let*-values (((a b) (values x y))
//                ((x y) (values a b)))
//    (list a b x y)))          ⇒ (x y x y)
//  //(begin)
//(define x 0)
//
//(begin (set! x 5)
//       (+ x 1))                          ⇒  6
//
//(begin (display "4 plus 1 equals ")
//       (display (+ 4 1)))              ⇒  unspecified
//  and prints  4 plus 1 equals 5
})

describe('11.5 Equivalence predicates', {
  'eqv?' : function(){
    ev("(eqv? 'a 'a)").should_be(true);
    ev("(eqv? 'a 'b)").should_be(false);
    ev("(eqv? 2 2)").should_be(true);
    ev("(eqv? '() '())").should_be(true);
    ev("(eqv? 100000000 100000000)").should_be(true)
    ev("(eqv? (cons 1 2) (cons 1 2))").should_be(false)
    ev("(eqv? (lambda () 1) (lambda () 2))").should_be(false);
    ev("(eqv? #f 'nil)").should_be(false);
  },
  'eq?' : function(){
    ev("(eq? 'a 'a)").should_be(true);
    ev("(eq? (list 'a) (list 'a))").should_be(false);
    ev("(eq? '() '())").should_be(true);
    ev("(eq? car car)").should_be(true);
    ev("(let ((x '(a))) (eq? x x))").should_be(true)
  },
  'equal?' : function(){
    ev("(equal? 'a 'a)").should_be(true);
    ev("(equal? '(a) '(a))").should_be(true);
    ev("(equal? '(a (b) c) '(a (b) c))").should_be(true);
    ev('(equal? "abc" "abc")').should_be(true);
    ev("(equal? 2 2)").should_be(true);
    ev("(equal? (make-vector 5 'a) (make-vector 5 'a))").should_be(true);
    //ev("(equal? '#vu8(1 2 3 4 5)
    //        (u8-list->bytevector
    //         '(1 2 3 4 5))                  ⇒  #t
    ev("(let* ((x (list 'a)) (y (list 'a)) (z (list x y))) (vector (equal? z (list y x)) (equal? z (list x x))))").should_be([true,true]);
  }
})

describe('11.6 Procedure predicate' , {
  'procedure?' : function() {
    ev("(procedure? (lambda ()))").should_be(true);
    ev("(procedure? #(lambda ()))").should_be(false);
    ev("(procedure? car)").should_be(true);
    ev("(procedure? if)").should_be(false);
    ev("(procedure? define-macro)").should_be(false);
    // TODO: Following test cases don't work.
    // call/cc are builtin subr(byte code instruction). 
    // ev("(procedure? call/cc)").should_be(true);
    // ev("(procedure? call-with-current-continuation)").should_be(true);
  }  
})

describe('11.7 Arithmetic', {
  'numerical type predicates' : function(){
    ev("(number? 108)").should_be(true);
    ev("(number? 42.195)").should_be(true);
    ev("(number? +nan.0)").should_be(true);
    ev("(integer? 108)").should_be(true);
    ev("(integer? 3.0)").should_be(true);
    ev("(integer? -inf.0)").should_be(false);
  },
  '= < > <= >=' : function(){
    ev("(= 1 1 1)").should_be(true);
    ev("(= 1 2)").should_be(false);
    ev("(< 1 2 3)").should_be(true);
    ev("(< 1 4 3)").should_be(false);
    ev("(> 3 2 1)").should_be(true);
    ev("(> 1 4 3)").should_be(false);
    ev("(<= 1 2 2 3)").should_be(true);
    ev("(<= 1 4 2 3)").should_be(false);
    ev("(>= 3 2 2 1)").should_be(true);
    ev("(>= 4 2 2 3)").should_be(false);
  },
  'zero?' : function(){
    ev("(zero? +0.0)").should_be(true);
    ev("(zero? -0.0)").should_be(true);
    ev("(zero? +nan.0)").should_be(false);
  },
  'positive?, negative?' : function(){
    ev("(positive? 100)").should_be(true);
    ev("(positive? -100)").should_be(false);
    ev("(negative? 100)").should_be(false);
    ev("(negative? -100)").should_be(true);
    ev("(positive? +inf.0)").should_be(true);
    ev("(negative? -inf.0)").should_be(true);
    ev("(positive? +nan.0)").should_be(false);
    ev("(negative? +nan.0)").should_be(false);
  },
  'odd?, even?' : function(){
    ev("(odd? 3)").should_be(true);
    ev("(odd? -3)").should_be(true);
    ev("(odd? 0)").should_be(false);
    ev("(odd? 2.5)").should_be(false);
    ev("(even? 2)").should_be(true);
    ev("(even? -2)").should_be(true);
    ev("(even? 1)").should_be(false);
    ev("(even? 2.5)").should_be(false);
  },
  'finite?, infinite?' : function(){
    ev("(finite? +inf.0").should_be(false);
    ev("(finite? 5)").should_be(true);
    ev("(finite? 5.0)").should_be(true);
    ev("(finite? +nan.0)").should_be(false);
    ev("(infinite? 5.0)").should_be(false);
    ev("(infinite? +inf.0)").should_be(true);
    ev("(infinite? -inf.0)").should_be(true);
  },
  'nan?' : function(){
    ev("(nan? +nan.0)").should_be(true);
    ev("(nan? +inf.0)").should_be(false);
  },
  'max min' : function(){
    ev("(min 10 3.9 4)").should_be(3.9);
    ev("(max 0 3.9 4)").should_be(4);
  },
  '+ * - /' : function(){
    ev("(+)").should_be(0);
    ev("(+ 1 2 3)").should_be(6);
    ev("(- 6 3 2)").should_be(1);
    ev("(*)").should_be(1);
    ev("(* 2 3 4)").should_be(24);
    ev("(/ 12 2 3)").should_be(2);
  },
  'abs' : function(){
    ev("(abs -7)").should_be(7);
    ev("(abs 7)").should_be(7);
  },
  'number->string' : function(){
    ev('(number->string 100)').should_be("100");
    ev('(number->string 32 16)').should_be("20");
  },
  'string->number' : function(){
    ev('(string->number "100")').should_be(100)
    ev('(string->number "100" 16)').should_be(256)
    //ew('(string->number "1e2"').should_be("100.0") TODO
    //ev('(string->number "0/0")').should_be(false) TODO
    ev('(string->number "+inf.0")').should_be(Infinity)
    ev('(string->number "-inf.0")').should_be(-Infinity)
    ew('(string->number "+nan.0")').should_be("+nan.0")
  },
  'complex' : function() {
    ev('(magnitude (make-rectangular 3 4))').should_be(5)
  }
})

describe('11.8 Booleans', {
  'not' : function(){
    ev("(not #t)").should_be(false);
    ev("(not 0)").should_be(false);
    ev("(not (list 0))").should_be(false);
    ev("(not #f)").should_be(true);
    ev("(not '())").should_be(false);
    ev("(not (list))").should_be(false);
    ev("(not 'nil)").should_be(false);
  },
  'boolean?' : function(){
    ev("(boolean? #f)").should_be(true);
    ev("(boolean? 0)").should_be(false);
    ev("(boolean? '())").should_be(false);
  },
  'boolean=?' : function(){
    ev("(boolean=? #t #t #t)").should_be(true);
    ev("(boolean=? #t #f #t)").should_be(false);
    ev("(boolean=? #t #f #f)").should_be(false);
  }
});

describe('11.9 Pairs and lists', {
  'pair?' : function(){
    ev("(pair? '(a . b))").should_be(true); 
    ev("(pair? '(a b c))").should_be(true); 
    ev("(pair? '())").should_be(false); 
    ev("(pair? '#(a b))").should_be(false); 
  },
  'cons' : function(){
    ew("(cons 'a '())").should_be("(a)"); 
    ew("(cons '(a) '(b c d))").should_be("((a) b c d)"); 
    ew("(cons \"a\" '(b c))").should_be('("a" b c)'); 
    ew("(cons 'a 3)").should_be("(a . 3)"); 
    ew("(cons '(a b) 'c)").should_be("((a b) . c)"); 
  },
  'car' : function(){
    ew("(car '(a b c))").should_be("a");
    ew("(car '((a) b c d))").should_be("(a)");
    ev("(car '(1 . 2))").should_be(1);
    //ev("(car '())").                 &assertion exception
  },
  'cdr' : function(){
    ew("(cdr '((a) b c d))").should_be("(b c d)");
    ev("(cdr '(1 . 2))").should_be(2);
    //ev("(cdr '())").                 &assertion exception
  },
  'caar' : function(){ ev("(caar '((1 . 2) 3 . 4))").should_be(1); },
  'cadr' : function(){ ev("(cadr '((1 . 2) 3 . 4))").should_be(3); },
  'cdar' : function(){ ev("(cdar '((1 . 2) 3 . 4))").should_be(2); },
  'cddr' : function(){ ev("(cddr '((1 . 2) 3 . 4))").should_be(4); },
  'cadar' : function(){ ev("(cadar '((1 2) (3 4))").should_be(2); },
  'caadr' : function(){ ev("(caadr '((1 2) (3 4))").should_be(3); },
  'cadadr' : function(){ ev("(cadadr '((1 2) (3 4))").should_be(4); },
  'null?' : function(){
    ev("(null? '())").should_be(true);
    ev("(null? #f)").should_be(false);
  },
  'list?' : function(){
    ev("(list? '(a b c))").should_be(true);
    ev("(list? '())").should_be(true);
    ev("(list? '(a . b))").should_be(false);
    //TODO: test for cyclic list
  },
  'list' : function(){
    ew("(list 'a (+ 3 4) 'c)").should_be("(a 7 c)");
    ew("(list)").should_be("()");
  },
  'length' : function(){
    ev("(length '(a b c))").should_be(3);
    ev("(length '(a (b) (c d e)))").should_be(3);
    ev("(length '())").should_be(0);
  },
  'append' : function(){
    ew("(append '(x) '(y))").should_be("(x y)");
    ew("(append '(a) '(b c d))").should_be("(a b c d)");
    ew("(append '(a (b)) '((c)))").should_be("(a (b) (c))");
    ew("(append '(a b) '(c . d))").should_be("(a b c . d)");
    ew("(append '() 'a)").should_be("a");
  },
  'reverse' : function(){
    ew("(reverse '(a b c))").should_be("(c b a)");
    ew("(reverse '(a (b c) d (e (f))))").should_be("((e (f)) d (b c) a)");
  },
  'list-tail' : function(){
    ew("(list-tail '(a b c d) 2)").should_be("(c d)");
  },
  'list-ref' : function(){
    ew("(list-ref '(a b c d) 2)").should_be("c");
  },
  'map' : function(){
    ew("(map (lambda (x) (+ x 1)) '(1 2 3))").should_be("(2 3 4)");
    ew("(map + '(1 2 3) '(4 5 6))").should_be("(5 7 9)");
  },
  'for-each' : function(){
    ev("(let ((v (make-vector 5))) (for-each (lambda (i) (vector-set! v i (* i i))) '(0 1 2 3 4)) v)").should_be([0, 1, 4, 9, 16]);
    ev("(let1 a 1 (for-each (lambda (x y) (set! a (+ x y))) '(1 2) '(3 4)) a)").should_be(6);
  }
});

describe('11.10  Symbols', {
  'symbol?' : function(){
    ev("(symbol? 'foo)").should_be(true);
    ev("(symbol? (car '(a b)))").should_be(true);
    ev('(symbol? "bar")').should_be(false);
    ev("(symbol? 'nil)").should_be(true);
    ev("(symbol? '())").should_be(false);
    ev("(symbol? #f)").should_be(false);
  },
  'symbol->string' : function(){
    ev("(symbol->string 'flying-fish)").should_be("flying-fish");
    ev("(symbol->string 'Martin)").should_be("Martin");
    ev('(symbol->string (string->symbol "Malvina"))').should_be("Malvina");
  },
  'symbol=?' : function(){
    ev("(symbol=? 'foo 'foo)").should_be(true);
    ev("(symbol=? 'foo 'bar)").should_be(false);
    ev('(symbol=? \'foo (string->symbol "foo")').should_be(true);
  },
  'string->symbol' : function(){
    ev("(eq? 'bitBlt (string->symbol \"bitBlt\"))").should_be(true);
    ev("(eq? 'JollyWog (string->symbol (symbol->string 'JollyWog)))").should_be(true);
    ev('(string=? "K. Harper, M.D." (symbol->string (string->symbol "K. Harper, M.D.")))').should_be(true);
  }
})

describe('11.11  Characters', {
  'char?' : function(){
    ev('(char? #\\a)').should_be(true);
    ev('(char? #\\A)').should_be(true);
    ev('(char? #\\()').should_be(true);
    ev('(char? #\\ )').should_be(true);
//    ev('(char? #\\nul)').should_be(true);
//    ev('(char? #\\alarm)').should_be(true);
//    ev('(char? #\\backspace)').should_be(true);
//    ev('(char? #\\tab)').should_be(true);
//    ev('(char? #\\linefeed)').should_be(true);
//    ev('(char? #\\newline)').should_be(true);
//    ev('(char? #\\vtab)').should_be(true);
//    ev('(char? #\\page)').should_be(true);
//    ev('(char? #\\return)').should_be(true);
//    ev('(char? #\\esc)').should_be(true);
//    ev('(char? #\\space)').should_be(true);
//    ev('(char? #\\delete)').should_be(true);
//    ev('(char? #\\xFF)').should_be(true);
//    ev('(char? #\\x03BB)').should_be(true);
//    ev('(char? #\\00006587)').should_be(true);
//    ev('(char? #\\λ)').should_be(true);
//    ev('(char? #\\xA)').should_be(true);
//    ev('(char? #\\xFF)').should_be(true);
//    ev('(char? #\\xff)').should_be(true);
//    ev('(char? #\\000000001)').should_be(true);
//    ev('(char? #\\space)').should_be(true);
  },
  'char->integer' : function(){
    ev("(char->integer #\\space)").should_be(32);
  },
  'integer->char' : function(){
    ew("(integer->char 32)").should_be("#\\space");
    ev("(char->integer (integer->char 5000))").should_be(5000);
  },
  'char=?' : function(){
    ev("(char=? #\\あ #\\あ)").should_be(true);
    ev("(char=? #\\　 #\\ )").should_be(false);
  },
  'char<?' : function(){
    ev("(char<? #\\a #\\z)").should_be(true);
    ev("(char<? #\\z #\\Z)").should_be(false);
  }
  //char>?
  //char<=?
  //char>=?
})

describe('11.12  Strings', {
  'string?' : function(){
    ev('(string? "")').should_be(true);
    ev("(string? 'str)").should_be(false);
  },
  'make-string' : function(){
    ev('(make-string 3 #\\あ)').should_be("あああ");
    ev('(string-length (make-string 3))').should_be(3);
  },
  'string' : function(){
    ev('(string #\\あ #\\a)').should_be("あa");
  },
  'string-length' : function(){
    ev('(string-length "foo")').should_be(3);
    ev('(string-length "")').should_be(0);
  },
  'string-ref' : function(){
    ew('(string-ref "あいう" 1)').should_be("#\\い");
  },
  'string=?' : function(){
    ev('(string=? "foo" "foo")').should_be(true);
    ev('(string=? "foo" "bar")').should_be(false);
  },
  'string<?' : function(){
    ev('(string<? "z" "zz")').should_be(true);
    ev('(string<? "z" "Z")').should_be(false);
  },
  //string>?
  //string<=?
  //string>=?
  'substring' : function(){
    ev('(substring "foo" 0 2)').should_be("fo");
  },
  'string-append' : function(){
    ev('(string-append "foo" ":" "bar")').should_be("foo:bar")
  },
  'string->list' : function(){
    ew('(string->list "あa")').should_be("(#\\あ #\\a)");
  },
  'list->string' : function(){
    ev("(list->string '(#\\い #\\b))").should_be("いb");
  },
  'string-for-each' : function(){
    ew("(let1 a '() (string-for-each (lambda (c) (set! a (cons c a))) \"bar\") a)").should_be("(#\\r #\\a #\\b)")
    ew("(let1 a '() (string-for-each (lambda (c1 c2) (set! a (cons c1 c2))) \"foo\" \"bar\") a)").should_be("(#\\o . #\\r)")

  },
  'string-copy' : function(){
    ev('(string-copy "foo")').should_be("foo");
  }
})

describe('11.13  Vectors', {
  'vector?' : function(){
    ev("(vector? #(1 2 3)").should_be(true);
    ev("(vector? '(1 2 3)").should_be(false);
    ev("(vector? (lambda (x) (+ 1 x)))").should_be(false);
  },
  'make-vector' : function(){
    var ar = scm_eval("(make-vector 3)");
    expect(ar instanceof Array).should_be(true);
    expect(ar.length).should_be(3);

    ev("(make-vector 3 9)").should_be([9, 9, 9]);
  },
  'vector' : function(){
    ev("(vector 1 2 3)").should_be([1,2,3]);
  },
  'vector-length' : function(){
    ev("(vector-length #(1 2 3))").should_be(3);
  },
  'vector-ref' : function(){
    ev("(vector-ref '#(1 1 2 3 5 8 13 21) 5)").should_be(8)
  },
  'vector-set!' : function(){
    ev("(let ((a (vector 2 2 3))) (vector-set! a 0 1) a)").should_be([1,2,3])
  },
  'vector->list' : function(){
    ew("(vector->list #(1 2 3))").should_be("(1 2 3)")
  },
  'list->vector' : function(){
    ev("(list->vector '(1 2 3))").should_be([1,2,3])
  },
  'vector-fill!' : function(){
    ev("(let ((a (vector 1 2 3))) (vector-fill! a 0) a)").should_be([0,0,0])
  },
  'vector-map' : function(){
    ev("(vector-map (lambda (x) (+ x 1)) #(1 2 3))").should_be([2,3,4])
    ev("(vector-map + #(1 2 3) #(4 5 6))").should_be([5, 7, 9]);
  },
  'vector-for-each' : function(){
    ew("(let1 a '() (vector-for-each (lambda (x) (set! a (cons x a))) #(1 2 3)) a)").should_be("(3 2 1)")
    ew("(let1 a '() (vector-for-each (lambda (x y) (set! a (cons x y))) #(1 2 3) #(4 5 6)) a)").should_be("(3 . 6)")
  }
})

describe('11.14  Errors and violations', {
})

describe('11.15  Control features', {
  'apply' : function(){
    ev("(apply + (list 3 4))").should_be(7);
    //ev("(define (compose f g) (lambda args (f (apply g args)))) ((compose sqrt *) 12 75)").should_be(30);
    //TODO(parser)
  },
  'call/cc' : function(){
    ev("(call/cc (lambda (cc) (cc 3) 5))").should_be(3);
    ev("((lambda (x) (call/cc (lambda (cc) (cc x)))) 3)").should_be(3);
    ev("((lambda (x) (call/cc (lambda (cc) (cc x) 5))) 3)").should_be(3);
    ev("((lambda (z) ((lambda (x y) (call/cc (lambda (cc) (cc x)))) 3 4)) 100)").should_be(3);
    ev("((lambda (z) ((lambda (x y) (call/cc (lambda (cc) (cc x) 99))) 3 4)) 100)").should_be(3);
    ev("((lambda (z a) ((lambda (x y) (call/cc (lambda (cc) (cc x) 99))) 3 4)) 100 99)").should_be(3);
    ev("(call-with-current-continuation (lambda (exit) (for-each (lambda (x) (if (negative? x) (exit x))) '(54 0 37 -3 245 19)) #t))").should_be(-3);
    ev("(call-with-current-continuation procedure?)").should_be(true);
    ev("(call-with-current-continuation vector?)").should_be(false);
//(define list-length
//  (lambda (obj)
//    (call-with-current-continuation
//      (lambda (return)
//        (letrec ((r
//                  (lambda (obj)
//                    (cond ((null? obj) 0)
//                          ((pair? obj)
//                           (+ (r (cdr obj)) 1))
//                          (else (return #f))))))
//          (r obj))))))
//
//(list-length '(1 2 3 4))                    ⇒  4
//
//(list-length '(a b . c))                    ⇒  #f
//
  },
  'values, call-with-values' : function(){
    ev("(call-with-values (lambda () (values 1 2)) (lambda (x y) (+ x y)))").should_be(3);
//(call-with-values (lambda () (values 4 5))
//                  (lambda (a b) b))
//                                                           ⇒  5
//
//(call-with-values * -)                                     ⇒  -1
  }
  //dynamic-wind
})

describe('11.16  Iteration', {
//(let loop ((numbers '(3 -2 1 6 -5))
//           (nonneg '())
//           (neg '()))
//  (cond ((null? numbers) (list nonneg neg))
//        ((>= (car numbers) 0)
//         (loop (cdr numbers)
//               (cons (car numbers) nonneg)
//               neg))
//        ((< (car numbers) 0)
//         (loop (cdr numbers)
//               nonneg
//               (cons (car numbers) neg))))) 
//                ⇒  ((6 1 3) (-5 -2))
})

describe('11.17  Quasiquotation', {
  'simple' : function(){
    ew("`(list ,(+ 1 2) 4)").should_be("(list 3 4)");
  },
  'binding' : function(){
    ew("(let ((name 'a)) `(list ,name ',name))").should_be("(list a (quote a))"); 
  },
  'splicing' : function(){
    ew("`(a ,(+ 1 2) ,@(map abs '(4 -5 6)) b)").should_be("(a 3 4 5 6 b)");
  },
  'improper list' : function(){
    ew("`(( foo ,(- 10 3)) ,@(cdr '(c)) . ,(car '(cons)))").should_be("((foo 7) . cons)");
  }
//  ,
//  'vector quasiquotation' : function(){
//    ew("`#(10 5 ,(sqrt 4) ,@(map sqrt '(16 9)) 8)").should_be("#(10 5 2 4 3 8)");
//  }
})

describe('11.18  Binding constructs for syntactic keywords', {
})

describe('11.19  Macro transformers', {
})

///
/// R6RS Standard Libraries
///

describe('1 Unicode', {
})

describe('2 Bytevectors', {
})

describe('3 List utilities', {
  'find' : function(){
    ev("(find even? '(3 1 4 1 5 9))").should_be(4);
    ev("(find even? '(3 1 5 1 5 9))").should_be(false);
  },
  'for-all' : function(){
    ev("(for-all even? '(3 1 4 1 5 9))").should_be(false);
    ev("(for-all even? '(3 1 4 1 5 9 . 2))").should_be(false);
    ev("(for-all even? '(2 4 14))").should_be(true);
    //(for-all even? '(2 4 14 . 9)) 
    //                ⇒  &assertion exception
    ev("(for-all (lambda (n) (and (even? n) n)) '(2 4 14))").should_be(14);
    ev("(for-all < '(1 2 3) '(2 3 4))").should_be(true);
    ev("(for-all < '(1 2 4) '(2 3 4))").should_be(false);
    ev("(for-all < '() '() '())").should_be(true);
  },
  'exists' : function(){
    ev("(exists even? '(3 1 4 1 5 9))").should_be(true);
    ev("(exists even? '(3 1 1 5 9))").should_be(false);
    //    (exists even? '(3 1 1 5 9 . 2)) 
    //                    ⇒  &assertion exception
    ev("(exists (lambda (n) (and (even? n) n)) '(2 1 4 14))").should_be(2);
    ev("(exists < '(1 2 4) '(2 3 4))").should_be(true);
    ev("(exists > '(1 2 3) '(2 3 4))").should_be(false);
    ev("(exists < '() '() '())").should_be(false);
  },
  'filter' : function(){
    ew("(filter even? '(3 1 4 1 5 9 2 6))").should_be("(4 2 6)");
  },
  'partition' : function(){
    ew("(call-with-values (lambda () (partition even? '(3 1 4 1 5 9 2 6))) (lambda (x y) (list x y)))").should_be("((4 2 6) (3 1 1 5 9))");
  },
  'fold-left' : function(){
    ev("(fold-left + 0 '(1 2 3 4 5))").should_be(15);
    ew("(fold-left (lambda (a e) (cons e a)) '() '(1 2 3 4 5))").should_be("(5 4 3 2 1)");
    ev("(fold-left (lambda (count x) (if (odd? x) (+ count 1) count)) 0 '(3 1 4 1 5 9 2 6 5 3))").should_be(7);
    ev("(fold-left (lambda (max-len s) (max max-len (string-length s))) 0 '(\"longest\" \"long\" \"longer\"))").should_be(7);
    ew("(fold-left cons '(q) '(a b c))").should_be("((((q) . a) . b) . c)");
    ev("(fold-left + 0 '(1 2 3) '(4 5 6))").should_be(21);
  },
  'fold-right' : function(){
    ev("(fold-right + 0 '(1 2 3 4 5))").should_be(15);
    ew("(fold-right cons '() '(1 2 3 4 5))").should_be("(1 2 3 4 5)");
    ew("(fold-right (lambda (x l) (if (odd? x) (cons x l) l)) '() '(3 1 4 1 5 9 2 6 5))").should_be("(3 1 1 5 9 5)");
    ew("(fold-right cons '(q) '(a b c))").should_be("(a b c q)");
    ev("(fold-right + 0 '(1 2 3) '(4 5 6))").should_be(21); 
  },
  'remp' : function(){
    ew("(remp even? '(3 1 4 1 5 9 2 6 5))").should_be("(3 1 1 5 9 5)");
  },
  'remove' : function(){
    ew("(remove 1 '(3 1 4 1 5 9 2 6 5))").should_be("(3 4 5 9 2 6 5)");
  },
  'remv' : function(){
    ew("(remv 1 '(3 1 4 1 5 9 2 6 5))").should_be("(3 4 5 9 2 6 5)");
  },
  'remq' : function(){
    ew("(remq 'foo '(bar foo baz))").should_be("(bar baz)");
  },
  'memp' : function(){
    ew("(memp even? '(3 1 4 1 5 9 2 6 5))").should_be("(4 1 5 9 2 6 5)");
  },
  'memq' : function(){
    ew("(memq 'a '(a b c))").should_be("(a b c)");
    ew("(memq 'b '(a b c))").should_be("(b c)");
    ev("(memq 'a '(b c d))").should_be(false);
    ev("(memq (list 'a) '(b (a) c))").should_be(false);
  },
  'member' : function(){
    ew("(member (list 'a) '(b (a) c))").should_be("((a) c)");
  },
  'memv' : function(){
    ew("(memv 101 '(100 101 102))").should_be("(101 102)");
  },
  'assp' : function(){
    ew("(assp even? '((3 a) (1 b) (4 c)))").should_be("(4 c)");
    ew("(assp odd? '((3 a) (1 b) (4 c)))").should_be("(3 a)");
  },
  'assoc' : function(){
    ew("(assoc (list 'a) '(((a)) ((b)) ((c))))").should_be("((a))");
  },
  'assq' : function(){
    ew("(assq 'a '((a 1) (b 2) (c 3)))").should_be("(a 1)");
    ew("(assq 'b '((a 1) (b 2) (c 3)))").should_be("(b 2)");
    ev("(assq 'd '((a 1) (b 2) (c 3)))").should_be(false);
    ev("(assq (list 'a) '(((a)) ((b)) ((c))))").should_be(false);
  },
  'assv' : function(){
    ew("(assv 5 '((2 3) (5 7) (11 13)))").should_be("(5 7)");
  },
  'cons*' : function(){
    ew("(cons* 1 2 '(3 4 5))").should_be("(1 2 3 4 5)");
    ew("(cons* 1 2 3)").should_be("(1 2 . 3)");
    ev("(cons* 1)").should_be(1);
  }
})

describe('4 Sorting', {
})

describe('5 Control structures', {
  'when' : function(){
    ev("(when (> 3 2) 99)").should_be(99);
    ew("(when (< 3 2) 99)").should_be("#<undef>");
  },
  'unless' : function(){
    ew("(unless (> 3 2) 99)").should_be("#<undef>");
    ev("(unless (< 3 2) 99)").should_be(99);
  }
})

describe('6 Records', {
})

describe('7 Exceptions and conditions', {
})

describe('8 I/O', {
  'eof-object' : function(){
    ev("(eqv? (eof-object) (eof-object))").should_be(true); 
    ev("(eq? (eof-object) (eof-object))").should_be(true);
  },
  'eof-object?' : function(){
    ev("(eof-object? (eof-object))").should_be(true);
    ev("(eof-object? 'eof)").should_be(false);
  }
})

describe('9 File System', {
})

describe('10 Command-line access and exit values', {
})

describe('12 syntax-case', {
})

describe('13 Hashtables', {
  'make-eq-hashtable, hashtable?': function(){
    ev("(hashtable? (make-eq-hashtable))").should_be(true);
    ev("(hashtable? (make-eq-hashtable 100))").should_be(true);
    ev("(hashtable? '((1 . 2)))").should_be(false);
  },
  'hashtable-size': function(){
    ew('(let* ((h (make-eq-hashtable))' +
       '       (s1 (hashtable-size h))' +
       '       (s2 (begin (hashtable-set! h "foo" 1)' +
       '                  (hashtable-size h))))' +
       '  (list s1 s2))').should_be("(0 1)");
  },
  'hashtable-set!, hashtable-ref': function(){
    ew('(let ((h (make-eq-hashtable)))' +
       '  (hashtable-set! h "foo" 1)' +
       '  (list (hashtable-ref h "foo" #f)' +
       '        (hashtable-ref h "bar" #f)))').should_be("(1 #f)");
  },
  'hashtable-delete!': function(){
    ev('(let ((h (make-eq-hashtable)))' +
       '  (hashtable-set! h "foo" 1)' +
       '  (hashtable-delete! h "foo")' +
       '  (hashtable-ref h "foo" #f))').should_be(false);
  },
  'hashtable-contains?': function(){
    ew('(let ((h (make-eq-hashtable)))' +
       '  (hashtable-set! h "foo" 1)' +
       '  (list (hashtable-contains? h "foo")' +
       '        (hashtable-contains? h "bar")))').should_be("(#t #f)");
  },
  'hashtable-keys': function(){
    ew('(let ((h (make-eq-hashtable)))' +
       '  (hashtable-set! h "foo" 1)' +
       '  (hashtable-keys h))').should_be('#("foo")');
  },
  'hashtable-entries': function(){
    ew('(call-with-values' +
       '  (lambda () (let ((h (make-eq-hashtable)))' +
       '               (hashtable-set! h "foo" 1)' +
       '               (hashtable-entries h)))' +
       '  list)').should_be('(#("foo") #(1))');
  }
})

describe('14 Enumerators', {
})

describe('15 Composite library', {
})

describe('16 eval', {
  'eval' : function(){
    ev("(eval '(+ 1 2))").should_be(3); 
  }
})

describe('17 Mutable pairs', {
})

describe('18 Mutable strings', {
})

describe('19 R5RS compatibility', {
//(exact->inexact z)    procedure 
//(inexact->exact z)    procedure 
//
//(quotient n1 n2)    procedure 
//(remainder n1 n2)    procedure 
//(modulo n1 n2)    procedure
//
//(delay <expression>)    syntax  
//(force promise)    procedure 
//(make-promise (lambda () <expression>))
//
//(null-environment n)    procedure 
//(scheme-report-environment n)    procedure 
})

describe('browser functions', {
  'element-empty!' : function(){
    scm_eval('(element-empty! ($ "div1"))');
    expect( $("div1").innerHTML ).should_be("");
  },
  'element-remove!' : function(){
    $("div1").update("<div id='div2'>foo</div>");
    scm_eval('(element-remove! ($ "div2"))');
    expect( $("div1").innerHTML ).should_be("");
  },
  'element-hide!' : function(){
    $("div1").show();
    scm_eval('(element-hide! ($ "div1"))');
    expect( $("div1").visible() ).should_be(false);
  },
  'element-show!' : function(){
    $("div1").hide();
    scm_eval('(element-show! ($ "div1"))');
    expect( $("div1").visible() ).should_be(true);
  },
  'sleep' : function(){
    (new BiwaScheme.Interpreter).evaluate("(begin 1 (sleep 0) 2)", function(result){
      expect(result).should_be(2);
    })
  },
  'js-call' : function() {
    ev('(js-call (js-eval "Math.pow") 2 4)').should_be(16);
  },
  'js-invoke' : function(){ 
    ev('(js-invoke (js-eval "Math") "pow" 2 4)').should_be(16);
  },
  'js-new' : function(){
    ev('(js-invoke (js-new "Date" 2008 1 1) "getFullYear")').should_be(2008);
    BiwaScheme.TestForJSNew = function(obj){
      this.foo = obj["foo"];
    };
    var tmp = scm_eval('(js-new "BiwaScheme.TestForJSNew" \'foo (lambda ()))');
    expect(Object.isFunction(tmp.foo)).should_be(true)
  },
  'js-null?' : function(){
    ev('(js-null? (js-eval "null"))').should_be(true);
    ev('(js-null? 0)').should_be(false);
  },
  'js-undefined?' : function(){
    ev('(js-undefined? (js-eval "undefined"))').should_be(true);
    ev('(js-undefined? 0)').should_be(false);
  }
});

describe('extra library', {
  'let1' : function(){
    ev("(let1 a (+ 1 2) (* a 3))").should_be(9);
  },

  'write-to-string': function(){
    ev("(write-to-string '(+ 1 2))").should_be("(+ 1 2)");
  },
  'read-from-string': function(){
    ew("(read-from-string \"(+ 1 2)\")").should_be("(+ 1 2)");
    ev("(eof-object? (read-from-string \"\"))").should_be(true);
  },
  'map-with-index': function(){
    ew("(map-with-index (lambda (i s) (list i s))" +
       "  '(a b))").should_be("((0 a) (1 b))");
  }
});

describe('srfi-1 list', {
  'iota' : function(){
    ew("(iota 3)").should_be("(0 1 2)");
    ew("(iota 3 1)").should_be("(1 2 3)");
  }
});

describe('srfi-27 random', {
  'random-integer' : function(){
    ev("(integer? (random-integer 3))").should_be(true);
  },
  'random-real' : function(){
    ev("(real? (random-real))").should_be(true);
  }
});

describe('srfi-30 comment syntax', {
  'simple(1)' : function(){
    ev("#| abc |# (+ 1 3)").should_be(4);
  },
  'simple(2)' : function(){
    ev("#|abc|# (+ 1 3)").should_be(4);
  },
  'simple(3)' : function(){
    ev("#|abc|#(+ 1 3)").should_be(4);
  },
  'simple(4)' : function(){
    ev("(+ 1 #|abc|# 3)").should_be(4);
  },
  'conjunction(symbol)' : function(){
    ev("(begin (define a 1) #|xxxx|#a)").should_be("1");
  },
  'conjunction(symbol and expression)' : function(){
    ev("#| abc \n\t asdfas xxxx|#(+ 1 3)").should_be(4);
  },
  'nested comments' : function(){
    ev("#| #|abc |# \n\t asdfas xxxx|# (+ 1 3)").should_be(4);
  },
  'token in a string' : function() {
    ev("\"#| abc |#|#\"").should_be("#| abc |#|#");
  }
});

describe('S expression comment(#;)', {
  'simple' : function() {
    ev("#;1 2").should_be(2);
    ev("1 #;2").should_be(1);
    ev("1 #;(1 2)").should_be(1);
    ev("#;(1 2) 1").should_be(1);
    ew("(list #;1)").should_be("()");
  },
  'in-list' : function() {
    ev("'(1 #;1 2)").should_be("(1 2)");
    ev("(list 1 #;1 3)").should_be("(1 3)");
    ev("(+ 1 #;1 4)").should_be("5");
  },
  'variety of data types' : function() {
    ev("(list 1 #;#t 2)").should_be("(1 2)");
    ev("(list 1 #;#(1 2 3) 3)").should_be("(1 3)");
    ev("(list 1 #;(+ 1  2) 4)").should_be("(1 4)");
    ev("(list 1 #;(a b c) 5)").should_be("(1 5)");
    ev("(list 1 #;a 6)").should_be("(1 6)");
    ev("(list 1 #;2.5 #;'a 8)").should_be("(1 8)");
    ev("(list 1 #;  \"a b c\" #;'a 9)").should_be("(1 9)");
    ev("(list 1 #;  \"#;\" #;'a 10)").should_be("(1 10)");
    ev("(list 1 #; a 11) ;#;").should_be("(1 11)");

  },
  'nested comments' : function() {
    ew("(list 1 #;(#;3) 'a)").should_be("(1 a)");
    ew("(list 1 #;#(#;3) 'b)").should_be("(1 b)");
    ew("(list 1 #;(#;3 #;1) 'c)").should_be("(1 c)");
    ew("(list 1 #;#(#;3 #;1) 'd)").should_be("(1 d)");
    ew("(list 1 #;(#;3 #;1 #;2) 'a)").should_be("(1 a)");
    ew("(list 1 #;#(#;3 #;1 #;2) 7)").should_be("(1 7)");
    ew("(list 1 #;#(#;3 #;1 #;2 2) 8)").should_be("(1 8)");
    ew("(list 1 #;#(#;3 #;1 #;2 2 #;(1 2 #;3)) 9)").should_be("(1 9)");
  }
});

};
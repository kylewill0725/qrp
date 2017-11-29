/*
Function wrapping code.
fn - reference to function
context - defines "this"
params - array of parameters to pass to fn.
Source: https://stackoverflow.com/a/899133
 */
let functionCall = (fn: Function, context: any, params: Array<any>) : Function => {
    return () => { fn.apply(context, params) };
};
Interactive-Form
This is an example of an interactive form. It is accessiblity friendly, and the input fields pass through multiple layers of validation.

Conditional Error Messages
All required input elements have conditional error messages, one for an empty field and another for a failure to match the prescribed pattern. This was achieved through inserting additional tooltips with Javascript and validating conditionally based on the specificity of the error. In addition, activity selection is prevented on the condition that the user has already selected a conflicting activity.

Real-time Error Messages
All required input elements (as well as registration activity checkbox elements and credit card select elements) have real time error validation. This was achieved by attaching event listeners for multiple forms of interaction to each element and parsing the type of validation within each element's validation handler.

This form was built using HTML, CSS, and JavaScript.

License
MIT - attribute James Crosslin

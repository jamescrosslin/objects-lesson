//////////////     SHARED  RESOURCES    /////////////////////////
function getById(id) {
  return document.getElementById(id);
}

/**
 * @function showOrHideElement
 * @param {element} element
 * @param {boolean} condition
 * @description displays an element on true and hides it on false
 */
function showOrHideElement(element, condition) {
  element.style.display = condition ? 'inherit' : 'none';
  return condition;
}

/**
 * @function isValid
 * @param {element} toolTip
 * @param {boolean} failureConditions
 * @description if failureConditions are met, the toolTip is shown and returns false for not valid,
 * and if no failureConditions are met, the toolTip is hidden and returns true for valid
 */
function isValid(toolTip, failureConditions) {
  return !showOrHideElement(toolTip, failureConditions);
}

const pattern = {
  'name': /^[^\d]+$/,
  'email': /^[^@]+@[^@.]+\.[a-z]+$/i,
  'cc-num': /^\d{13,16}$/,
  'zip': /^\d{5}$/,
  'cvv': /^\d{3}$/,
};

/**
 * @function validationHandler
 * @param {element} element
 * @returns {boolean} indicates if there is an error
 * @description takes in an element handles stages of testing
 * that element's value
 */
function validationHandler(element) {
  const id = element.id;
  const text = element.value;
  const tip = element.nextElementSibling;
  const patternTip = tip?.nextElementSibling;
  const container = element.parentElement;

  // we test if the input is empty text or an unselected credit card
  // select element, and activate our standard empty field tool tip
  let valid = isValid(
    tip,
    text === '' ||
      (id === 'exp-month' && text === 'Select Date') ||
      (id === 'exp-year' && text === 'Select Year'),
  );

  //only certain elements have a pattern to match during their validation
  if (patternTip) {
    // if the input is not empty, we test its pattern here,
    // otherwise we hide the patternTip to avoid conflicting tool tips
    valid
      ? (valid = isValid(patternTip, !pattern[id].test(text)))
      : showOrHideElement(patternTip, false);
  }

  container.classList.toggle('valid', valid);
  container.classList.toggle('not-valid', !valid);
  return valid;
}

/**
 * @function createListener
 * @param {event} e
 * @description placing my callback like this allows me give validationHandler
 * an element as an argument instead of the whole event, increasing its modularity in this program
 */
function createListener(e) {
  return validationHandler(e.target);
}

////////////////       BASIC INFO SECTION   ///////////////////////////
const info = {
  name: getById('name'),
  email: getById('email'),
  title: getById('title'),
  other: getById('other-job-role'),
};

info.title.addEventListener('change', () => {
  showOrHideElement(info.other, title.value === 'other');
  info.other.focus();
});

////////////////       T-SHIRT SECTION   ///////////////////////////
const shirtColor = getById('color');

/**
 * @function shirtHandler
 * @param {event} e 
 * @description once the t-shirt design selection element is changed, shirt color selection is re-enabled
    and color choices are filtered to match the design choice
 */
function shirtHandler(e) {
  shirtColor.disabled = false;
  const colors = [...shirtColor.children];
  colors.forEach((option) => (option.selected = false));
  colors.filter((option) =>
    showOrHideElement(option, option.getAttribute('data-theme') === e.target.value),
  )[0].selected = true;
}

getById('design').addEventListener('change', shirtHandler);

////////////////       ACTIVITY SECTION    ///////////////////////////
const checkboxes = document.querySelectorAll("input[type='checkbox']");

/**
 * @function checkActivitySelection
 * @description validates whether boxes are checked and changes the class of the
  activities registration container to match
 */
function checkActivitySelection() {
  const container = getById('activities').firstElementChild;
  const valid = isValid(
    getById('activities-hint'),
    [...checkboxes].every((checkbox) => !checkbox.checked),
  );
  container.classList.toggle('valid', valid);
  container.classList.toggle('not-valid', !valid);
  return valid;
}

/**
 * @function updateCost
 * @param {element} activity 
 * @description extracts the cost value on the activity element to a number, extracts the
  current cost from the total with a regex, and either adds or subtracts the cost to the total
 */
function updateCost(activity) {
  const cost = +activity.getAttribute('data-cost');
  const activitiesCost = getById('activities-cost');
  const total = +activitiesCost.textContent.replace(/\D+(\d+)$/, '$1');
  activitiesCost.textContent = `Total: $${activity.checked ? total + cost : total - cost}`;
}

/**
 * @function updateSchedule
 * @param {element} activity
 * @description checks the date and time of each activity, disabling unchecked conflicting activities
 */
function updateSchedule(activity) {
  [...checkboxes].forEach((checkbox) => {
    if (
      checkbox.getAttribute('data-day-and-time') === activity.getAttribute('data-day-and-time') &&
      checkbox.name !== activity.name
    ) {
      checkbox.disabled = !checkbox.disabled;
      checkbox.parentElement.classList.toggle('disabled');
    }
  });
}

function activityHandler(e) {
  checkActivitySelection();
  updateCost(e.target);
  updateSchedule(e.target);
}

////////////////       PAYMENT SECTION   ///////////////////////////
const paySelect = getById('payment');
const payMethods = {
  creditCard: getById('credit-card'),
  paypal: getById('paypal'),
  bitcoin: getById('bitcoin'),
};

const ccInputs = {
  month: getById('exp-month'),
  year: getById('exp-year'),
  cardNum: getById('cc-num'),
  zip: getById('zip'),
  cvv: getById('cvv'),
};

/**
 * @listens paySelect
 * @description checks each element saved in payMethods object to see if 
  it matches the payment method selectec, displaying only the appropriate element
 */
paySelect.addEventListener('change', (e) => {
  for (const method of Object.values(payMethods)) {
    showOrHideElement(method, e.target.value === method.id);
  }
});

////////////////       SUBMISSION VALIDATION ONLY   ///////////////////////////
function massValidate(e, ...inputs) {
  inputs.forEach((input) => {
    if (!validationHandler(input)) e.preventDefault();
  });
}

function validateForm(e) {
  if (!checkActivitySelection()) {
    e.preventDefault();
  }
  massValidate(e, info.name, info.email);
  if (paySelect.value === 'credit-card') massValidate(e, ...Object.values(ccInputs));
}

document.querySelector('form').addEventListener('submit', validateForm);

////////////////      SET-UP BEGINNING PAGE STATE   ///////////////////////////

info.name.focus();
info.name.nextElementSibling.insertAdjacentHTML(
  'afterend',
  `<span class="hint">Name field cannot contain numbers</span>`,
);
showOrHideElement(info.other, false);
shirtColor.disabled = true;
paySelect.removeChild(paySelect.firstElementChild);
showOrHideElement(payMethods.paypal, false);
showOrHideElement(payMethods.bitcoin, false);

/**
   * @method forEach
   * @description places a standard error tooltip on required non-checkbox inputs 
    for empty fields except for the name input, which already has such a tooltip
   */
[info.email, ...Object.values(ccInputs)].forEach((input) => {
  input.insertAdjacentHTML('afterend', `<span class="hint">Field cannot be blank</span>`);
});

/**
 * @method forEach
 * @description places listeners on required non-checkbox inputs for dynamic validation
 */
[info.name, info.email, ...Object.values(ccInputs)].forEach((input) => {
  input.addEventListener('keyup', createListener);
  input.addEventListener('blur', createListener);
  input.addEventListener('change', createListener);
});

/**
   * @method forEach
   * @description places listeners on required checkboxes for triggering the activity handler
    as well as for adding and removing the focus class for accessibility
   */
checkboxes.forEach((input) => {
  const label = input.parentNode;
  input.addEventListener('change', activityHandler);
  input.addEventListener('focus', (e) => label.classList.add('focus'));
  input.addEventListener('blur', (e) => label.classList.remove('focus'));
});

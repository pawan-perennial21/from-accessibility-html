document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('accessibleForm');
  const emailField = document.getElementById('email');
  const passwordField = document.getElementById('password');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');

  // Email and Password Validation Rules
  const validationRules = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      errorMessage: 'Invalid email address',
    },
    password: {
      required: true,
      minLength: 6,
      errorMessage: 'Password must be at least 6 characters',
    },
  };

  const speakMessage = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    speechSynthesis.speak(utterance);
  };

  const validateField = (field, errorElement, rules) => {
    let isValid = true;
    if (rules.required && !field.value.trim()) {
      isValid = false;
      errorElement.textContent = `${field.name} is required.`;
    } else if (rules.pattern && !rules.pattern.test(field.value)) {
      isValid = false;
      errorElement.textContent = rules.errorMessage;
    } else if (rules.minLength && field.value.length < rules.minLength) {
      isValid = false;
      errorElement.textContent = rules.errorMessage;
    } else {
      errorElement.textContent = '';
    }

    field.setAttribute('aria-invalid', !isValid);
    if (!isValid) {
      speakMessage(errorElement.textContent);
    }
    return isValid;
  };

  const addFocusListener = (field, message) => {
    field.addEventListener('focus', () => {
      speakMessage(message);
    });
  };

  const onFieldBlur = (field, errorElement, rules) => {
    field.addEventListener('blur', () => {
      validateField(field, errorElement, rules);
    });
  };

  // Adding focus and blur listeners to fields
  addFocusListener(emailField, 'Please enter your email.');
  addFocusListener(passwordField, 'Please enter your password.');

  onFieldBlur(emailField, emailError, validationRules.email);
  onFieldBlur(passwordField, passwordError, validationRules.password);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const isEmailValid = validateField(
      emailField,
      emailError,
      validationRules.email
    );
    const isPasswordValid = validateField(
      passwordField,
      passwordError,
      validationRules.password
    );

    if (isEmailValid && isPasswordValid) {
      console.log({
        email: emailField.value,
        password: passwordField.value,
      });
      form.reset();
      speakMessage('Form submitted successfully.'); // Announce successful submission
    }
  });
});

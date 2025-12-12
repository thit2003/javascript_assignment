$(function () {
  const $username = $('#username');
  const $email = $('#email');
  const $password = $('#password');
  const $confirm = $('#confirmPassword');
  const $topics = $('.topic');
  const $gender = $('#gender');

  const $usernameErr = $('#usernameError');
  const $emailErr = $('#emailError');
  const $passwordErr = $('#passwordError');
  const $confirmErr = $('#confirmPasswordError');
  const $topicsErr = $('#topicsError');
  const $genderErr = $('#genderError');

  function setError($input, $errContainer, message) {
    $input.addClass('input-error');
    if ($errContainer) $errContainer.text(message);
  }

  function clearError($input, $errContainer) {
    $input.removeClass('input-error');
    if ($errContainer) $errContainer.text('');
  }

  function validateNotEmpty($input, $errContainer) {
    const val = ($input.val() || '').trim();
    if (!val) {
      setError($input, $errContainer, 'this field must not be empty');
      return false;
    }
    clearError($input, $errContainer);
    return true;
  }

  function validateTopics() {
    const anyChecked = $topics.is(':checked');
    if (!anyChecked) {
      $topicsErr.text('At least one topic must be selected');
      return false;
    }
    $topicsErr.text('');
    return true;
  }

  function validateGender() {
    const val = ($gender.val() || '').trim();
    if (!val || val === '--') {
      $genderErr.text('please choose your gender');
      return false;
    }
    $genderErr.text('');
    return true;
  }

  function validateConfirmPassword() {
    const pass = ($password.val() || '').trim();
    const conf = ($confirm.val() || '').trim();
    // First check non-empty for confirm (sets appropriate message)
    const nonEmpty = validateNotEmpty($confirm, $confirmErr);
    if (!nonEmpty) return false;

    if (pass !== conf) {
      setError($confirm, $confirmErr, 'confirmed password mismatched the password');
      return false;
    }
    clearError($confirm, $confirmErr);
    return true;
  }

  // Field-level live validation on blur/input
  $username.on('blur input', () => validateNotEmpty($username, $usernameErr));
  $email.on('blur input', () => validateNotEmpty($email, $emailErr));
  $password.on('blur input', () => validateNotEmpty($password, $passwordErr));
  $confirm.on('blur input', () => validateConfirmPassword());

  $topics.on('change', validateTopics);
  $gender.on('change', validateGender);

  $('#submitBtn').on('click', function (e) {
    e.preventDefault();
    const v1 = validateNotEmpty($username, $usernameErr);
    const v2 = validateNotEmpty($email, $emailErr);
    const v3 = validateNotEmpty($password, $passwordErr);
    const v4 = validateConfirmPassword();
    const v5 = validateTopics();
    const v6 = validateGender();

    // Add explicit red borders for empty fields
    if (!v1) $username.addClass('input-error');
    if (!v2) $email.addClass('input-error');
    if (!v3) $password.addClass('input-error');
    if (!v4) $confirm.addClass('input-error');

    const allValid = v1 && v2 && v3 && v4 && v5 && v6;
    if (allValid) {
      // Optionally show success or proceed
      alert('Form is valid!');
    }
  });
});

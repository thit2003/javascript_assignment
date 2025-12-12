$(function () {
  const STORAGE_KEY = 'users';

  const $tbody = $('#userTableBody');
  const $openBtn = $('#openNewUserBtn');
  const modalEl = document.getElementById('newUserModal');
  const modal = new bootstrap.Modal(modalEl);

  const $form = $('#newUserForm');
  const $username = $('#newUsername');
  const $fullname = $('#newFullname');
  const $email = $('#newEmail');

  const $uErr = $('#nuUsernameError');
  const $fErr = $('#nuFullnameError');
  const $eErr = $('#nuEmailError');

  function loadUsers() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveUsers(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function renderUsers(list) {
    $tbody.empty();
    if (!list || list.length === 0) {
      $tbody.append(
        '<tr><td colspan="3" class="text-center text-muted">No users yet</td></tr>'
      );
      return;
    }
    list.forEach((u) => {
      const row = `
        <tr>
          <td>${escapeHtml(u.username)}</td>
          <td>${escapeHtml(u.fullname)}</td>
          <td>${escapeHtml(u.email)}</td>
        </tr>`;
      $tbody.append(row);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function clearForm() {
    $username.val('');
    $fullname.val('');
    $email.val('');
    clearError($username, $uErr);
    clearError($fullname, $fErr);
    clearError($email, $eErr);
  }

  function setError($input, $err, msg) {
    $input.addClass('input-error');
    $err.text(msg || 'This field is required');
  }

  function clearError($input, $err) {
    $input.removeClass('input-error');
    $err.text('');
  }

  function validateNotEmpty($input, $err) {
    const val = ($input.val() || '').trim();
    if (!val) {
      setError($input, $err, 'This field must not be empty');
      return false;
    }
    clearError($input, $err);
    return true;
  }

  function validateEmail($input, $err) {
    const val = ($input.val() || '').trim();
    if (!val) return validateNotEmpty($input, $err);
    // Basic email pattern
    const ok = /.+@.+\..+/.test(val);
    if (!ok) {
      setError($input, $err, 'Please enter a valid email');
      return false;
    }
    clearError($input, $err);
    return true;
  }

  // Live validation
  $username.on('input blur', () => validateNotEmpty($username, $uErr));
  $fullname.on('input blur', () => validateNotEmpty($fullname, $fErr));
  $email.on('input blur', () => validateEmail($email, $eErr));

  let users = loadUsers();
  renderUsers(users);

  // Toggle modal on button click
  $openBtn.on('click', () => {
    if (modalEl.classList.contains('show')) {
      modal.hide();
    } else {
      clearForm();
      modal.show();
    }
  });

  // Save user
  $('#saveUserBtn').on('click', () => {
    const v1 = validateNotEmpty($username, $uErr);
    const v2 = validateNotEmpty($fullname, $fErr);
    const v3 = validateEmail($email, $eErr);
    if (!(v1 && v2 && v3)) return;

    const newUser = {
      username: $username.val().trim(),
      fullname: $fullname.val().trim(),
      email: $email.val().trim(),
    };

    users.push(newUser);
    saveUsers(users);
    renderUsers(users);

    clearForm();
    modal.hide();
  });
});

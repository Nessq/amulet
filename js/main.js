function changeRating(e) {
  if (e.target === e.currentTarget) return;

  const items = e.currentTarget.children;

  for (const item of items) {
    item.classList.remove('active');
  }

  for (const item of items) {
    item.classList.add('active');
    if (item === e.target) break;
  }
}

function getCountsRating() {
  return document.querySelectorAll('.js-rating .star.active').length;
}

function loaderForm(form) {
  form.classList.toggle('loading');
}

function clearNotify(form) {
  if (form.querySelector('.notify')) form.querySelector('.notify').remove();
}
function formNotify(form, status, text) {
  clearNotify(form);
  if (status === 'error') {
    form.insertAdjacentHTML('beforeend', '<p class="notify notify-error">' + text + '</p>');
  }
  if (status === 'success') {
    form.insertAdjacentHTML('beforeend', '<p class="notify notify-success">' + text + '</p>');
  }
}

function getLocalStorageReview() {
  return localStorage.getItem('review');
}
function setLocalStorageReview(body) {
  localStorage.setItem('review', body);
}

function setNewReview(name, message, counts) {
  const template = `<div class="bg-block bg-block--transparent reviews__item">
  <div class="reviews__top">
    <h3>${name}</h3>
    <div class="rating">
      <i class="star ${counts >= 1 ? 'active' : ''}"></i>
      <i class="star ${counts >= 2 ? 'active' : ''}"></i>
      <i class="star ${counts >= 3 ? 'active' : ''}"></i>
      <i class="star ${counts >= 4 ? 'active' : ''}"></i>
      <i class="star ${counts >= 5 ? 'active' : ''}"></i>
    </div>
  </div>
  <div class="reviews__body">
   ${message}
  </div>
</div>`;
  setLocalStorageReview(JSON.stringify(template));
}

function renderReview() {
  const templ = getLocalStorageReview();
  if (templ)
    document.querySelector('.reviews__items').insertAdjacentHTML('afterbegin', JSON.parse(templ));
}

document.addEventListener('DOMContentLoaded', function () {

  renderReview();
  // rating change
  const rating = document.querySelector('.js-rating');
  const btnTop = document.querySelector('.btn-top');
  const headerBtnTells = document.querySelector('.btn-tells');
  const headerTells = document.querySelector('.header-tells');

  const form1 = document.getElementById('form-1');
  const form2 = document.getElementById('form-2');

  const formAddReview = document.querySelector('.js-add-review');

  rating.addEventListener('click', changeRating);
  btnTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // menuBtn
  headerBtnTells.addEventListener('click', function (e) {
    e.stopPropagation();
    if (headerBtnTells.classList.contains('active')) {
      headerBtnTells.classList.remove('active');
      headerTells.classList.remove('active');
    } else {
      headerBtnTells.classList.add('active');
      headerTells.classList.add('active');
    }
  });
  document.addEventListener('click', function (e) {
    if (!headerBtnTells.classList.contains('active')) return;
    if (e.target.closest('.header-tells')) return;
    headerBtnTells.classList.remove('active');
    headerTells.classList.remove('active');
  });
  // menuBtn end

  formAddReview.addEventListener('submit', function (e) {
    const name = this.querySelector('input[name="review__name"]');
    const message = this.querySelector('textarea[name="review__body"]');
    const counts = getCountsRating();

    if (counts < 1) {
      e.preventDefault();
      return formNotify(this, 'error', 'не вибрали оцінку!');
    }
    
    if (getLocalStorageReview()) {
      e.preventDefault();
      return formNotify(this, 'error', 'Ви вже лишили відгук');
    }

    clearNotify(this);

    e.preventDefault();
    loaderForm(this);
    setTimeout(() => {
      loaderForm(this);
      formNotify(this, 'success', 'Дякуємо, ваш відгук відправлено!');
      setNewReview(name.value, message.value, counts);
      renderReview();
    }, 1500);
  });


  initFormSend(form1);
  initFormSend(form2);


});


function initFormSend(form){
  form.addEventListener('submit', function(e) {

    const name = this.querySelector('input[name="name"]').value;
    const phone = this.querySelector('input[name="phone"]').value.replace(/\D+/g, '');


    if(name.length <= 2){
      e.preventDefault();
      return formNotify(this, 'error', 'Ім\'я повинно бути більше 2 символів');
    } 
    if ((phone.length !== 12 && phone.length !== 10) || phone.length < 2) {
      e.preventDefault();
      return formNotify(this,'error', "Введіть коректний номер телефону!");
    }

    loaderForm(this);
  });
}
// 좋아요 모듈
export async function likeHeart(postingID) {
  const url = `https://mandarin.api.weniv.co.kr/post/${postingID}/heart`;
  const token = localStorage.getItem('Token');

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
  });
  const data = await res.json();
  return data;
}

// 좋아요 취소 모듈
export async function likeUnHeart(postingID) {
  const url = `https://mandarin.api.weniv.co.kr/post/${postingID}/unheart`;
  const token = localStorage.getItem('Token');
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
  });
  const data = await res.json();
  return data;
}

// 게시물 신고
export async function reportPost(postingId) {
  const url = 'https://mandarin.api.weniv.co.kr';
  const token = localStorage.getItem('Token');

  const setting = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
  };

  try {
    const resReport = await fetch(`${url}/post/${postingId}/report`, setting);
    const resReportJson = await resReport.json();
    if (resReportJson.status !== 404) {
      location.reload();
    }
  } catch (err) {
    console.error(err);
  }
}

// 게시물 삭제
export async function deletePost(postingId) {
  const url = 'https://mandarin.api.weniv.co.kr';
  const token = localStorage.getItem('Token');

  const setting = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
  };

  try {
    const resDeleteProduct = await fetch(`${url}/post/${postingId}`, setting);
    if (resDeleteProduct) {
      location.reload();
    }
  } catch (err) {
    console.error(err);
  }
}

// 댓글 신고
export async function reportComment(commentId) {
  const url = 'https://mandarin.api.weniv.co.kr';
  const token = localStorage.getItem('Token');
  const postId = window.location.hash.split('postid=')[1];

  try {
    const res = await fetch(`${url}/post/${postId}/comments/${commentId}/report`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    });
    const json = await res.json();
    if (json) {
      location.reload();
    }
  } catch (err) {
    console.log(err);
  }
}

// 댓글 삭제
export async function deleteComment(commentId) {
  const url = 'https://mandarin.api.weniv.co.kr';
  const token = localStorage.getItem('Token');
  const postId = window.location.hash.split('postid=')[1];

  try {
    const res = await fetch(`${url}/post/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    });
    const json = await res.json();
    if (json.status === '200') {
      location.reload();
    }
  } catch (err) {
    console.log(err);
  }
}

// 이미지 업로드
export async function imageUpload(formData) {
  const url = 'https://mandarin.api.weniv.co.kr';

  try {
    const response = await fetch(url + '/image/uploadfiles', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    const imageUrl = await data[0].filename;
    localStorage.setItem('imageUrl', imageUrl);
  } catch (err) {
    console.log(err);
  }
}

// 상품 등록
export async function productSave(productNameForm, productPriceForm, productContentForm) {
  const token = localStorage.getItem('Token');
  const url = 'https://mandarin.api.weniv.co.kr';
  const imageUrl = localStorage.getItem('imageUrl');
  const productInfo = {
    product: {
      itemName: productNameForm.value,
      price: parseInt(productPriceForm.value.replace(/,/g, '')),
      link: productContentForm.value,
      itemImage: `${url}/${imageUrl}`,
    },
  };
  const setting = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(productInfo),
  };
  try {
    const reqPosting = await fetch(`${url}/product`, setting);
    if (reqPosting.status === 200) {
      window.history.back(1);
    }
  } catch (error) {
    console.log(error);
  }
}

// 프로필 수정
export async function updateProfile() {
  const token = localStorage.getItem('Token');
  const url = 'https://mandarin.api.weniv.co.kr';
  const inputName = document.getElementById('name');
  const inputId = document.getElementById('id');
  const inputIntroduce = document.getElementById('introduce');
  const imageUrl = localStorage.getItem('imageUrl');
  const alertMessage = document.querySelector('.alertMessage');

  const userProfileInfo = {
    user: {
      username: inputName.value,
      accountname: inputId.value,
      intro: inputIntroduce.value,
      image: `${imageUrl}`,
    },
  };
  const setting = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(userProfileInfo),
  };
  try {
    const resEditProfile = await fetch(`${url}/user`, setting);
    const resEditProfileJson = await resEditProfile.json();
    // 응답 성공시
    if (resEditProfile.status === 200) {
      localStorage.setItem('accountname', inputId.value);
      window.history.back(1);
    } else {
      alertMessage.classList.remove('ir');
      alertMessage.innerText = `*${resEditProfileJson.message}`;
    }
  } catch (err) {
    console.error(err);
  }
}

// 게시물 확인
export async function getPosting() {
  const url = 'https://mandarin.api.weniv.co.kr';
  const token = localStorage.getItem('Token');
  const myAccountName = localStorage.getItem('accountname');
  let accountName = window.location.hash.split('accountname=')[1];
  accountName = accountName == null ? myAccountName : accountName;

  const setting = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
  };
  try {
    const resProfileProduct = await fetch(`${url}/post/${accountName}/userpost/?limit=9`, setting);
    const resProfileProductJson = await resProfileProduct.json();
    const userPostInfo = resProfileProductJson.post;
    return userPostInfo;
  } catch (err) {
    console.error(err);
  }
}

const postUploadTxt = document.querySelector(".postUploadComentTxt");
const postUploadInp = document.querySelector(".postUploadInput");
const postImgContainer = document.querySelector(".postUploadImageScreen");
const postUploadBtn = document.querySelector(".headerBarBtn.buttonClick");
const postImgItem = document.querySelector(".postImgItem");
const postUserProfile = document.querySelector(".userProfileImage");
const url = "https://mandarin.api.weniv.co.kr";
const curUrl = location.href;

const imgFiles = [];

// 파비콘 이미지
// 로그인 유저 정보
async function getLoginUserInfo() {
  const token = localStorage.getItem("Token");
  const accountname = localStorage.getItem("accountname");

  try {
    const res = await fetch(`${url}/profile/${accountname}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });
    const userJson = await res.json();
    postUserProfile.setAttribute("src", userJson.profile.image);
  } catch (err) {
    console.log(err);
  }
}

getLoginUserInfo();

// 사진 미리보기, 사진 삭제

function readInputFile(e) {
  const files = e.target.files;
  const fileArr = [...files];
  fileArr.forEach((file) => imgFiles.push(file));
  fileArr.forEach(function (i) {
    if (files.length <= 3) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imgItem = document.createElement("div");
        imgItem.style.backgroundImage = `url(${reader.result})`;
        imgItem.className = "postImgItem";

        postImgContainer.appendChild(imgItem);
        e.target.value = "";

        const closeBtn = document.createElement("button");
        closeBtn.className = "postImgCloseBtn";
        imgItem.appendChild(closeBtn);
        closeBtn.addEventListener("click", function () {
          // MEMO:: imgFiles에서 삭제, 미리보기에 삭제
          imgFiles.splice([...postImgContainer.children].indexOf(imgItem), 1);
          postImgContainer.removeChild(imgItem);
          // console.log(imgFiles);
        });
      };
      reader.readAsDataURL(i);
    }
  });
}
// postUploadInp.addEventListener("change", uploadImg);

// 이미지 업로드
let arrImg = [];
async function uploadImg(event) {
  const formData = new FormData();
  imgFiles.forEach((file) => {
    formData.append("image", file);
  });
  try {
    const response = await fetch(url + "/image/uploadfiles", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    data.forEach((data) => {
      arrImg.push(`${url}/${data.filename}`);
    });

    return arrImg;
  } catch (err) {
    alert("이미지 파일은 최대 3장까지만 가능합니다.");
  }
  imgFiles = [];
}

// postUploadComentTxt나 postUploadImageScreen에 이미지가 업로드되면 업로드버튼 활성화

postUploadBtn.disabled = true;
console.log(postUploadBtn);
function postInput() {
  if (postUploadTxt.value !== "" || postImgContainer.value !== "") {
    postUploadBtn.style.opacity = "1";
    postUploadBtn.disabled = false;
  } else {
    postUploadBtn.style.opacity = "0.3";
    postUploadBtn.disabled = true;
  }
}

// 게시글 작성 후 데이터 서버에 보내기

async function createPost() {
  const token = localStorage.getItem("Token");
  const contentText = postUploadTxt.value;
  const images = await uploadImg(imgFiles);

  const res = await fetch(`${url}/post`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      post: {
        content: contentText,
        image: images.join(","),
      },
    }),
  });
  const json = await res.json();
  // console.log(json);
  location.href = "../pages/profile.html";
}

if (curUrl.indexOf("postid=") == -1) {
  postUploadBtn.addEventListener("click", createPost);
}

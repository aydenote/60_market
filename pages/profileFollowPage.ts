import { init } from '../script/profileFollow';
import Footer from './footer';
import { backHistory } from '../utils/common';

const footer = new Footer();

class ProfileFollowPage {
  render(content: HTMLElement) {
    const footerEl = footer.render();

    // header
    const headerEl = document.createElement('header');
    const headerBarArticleEl = document.createElement('article');
    const backImgEl = document.createElement('img');
    const titlePEl = document.createElement('p');

    headerBarArticleEl.classList.add('headerBar');
    headerBarArticleEl.classList.add('followers');
    backImgEl.classList.add('headerBarBack');
    backImgEl.classList.add('buttonClick');
    backImgEl.setAttribute('src', '../asset/images/icons/icon__arrowLeft.svg');
    backImgEl.setAttribute('alt', '뒤로 가기');
    backImgEl.addEventListener('click', backHistory);
    titlePEl.classList.add('followTitle');

    headerBarArticleEl.appendChild(backImgEl);
    headerBarArticleEl.appendChild(titlePEl);
    headerEl.appendChild(headerBarArticleEl);

    // main
    const mainEl = document.createElement('main');
    const userSectionEl = document.createElement('section');
    const userListUlEl = document.createElement('ul');

    userListUlEl.classList.add('userList');
    userSectionEl.appendChild(userListUlEl);
    mainEl.appendChild(userSectionEl);

    // follow 리스트 구현
    init(userListUlEl);

    content.appendChild(headerEl);
    content.appendChild(mainEl);
    content.appendChild(footerEl);
  }
}

export default ProfileFollowPage;

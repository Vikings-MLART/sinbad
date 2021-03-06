'use strict';
//Random user images for https://randomuser.me/
let randomUserImageURL;
const generateRandomUser = function (userGender) {
  return new Promise(function (resolve) {
    fetch('https://randomuser.me/api/?results=1')
      .then(res => res.json())
      .then(data => {
        if (data.results[0].gender === userGender)
          return resolve(data.results[0].picture.large);
        else {
          return resolve(generateRandomUser(userGender));
        }
      });
  });
};

async function storySubmtionHandler(event) {
  event.preventDefault();
  const userName = event.target.name.value;
  const usetStoryText = event.target.description.value;
  const userGender = event.target.gender.value;
  randomUserImageURL = await generateRandomUser(userGender);
  let picArray = event.target.pictuers.value.split(' ');
  picArray = trimImageURL(picArray);
  new Story(userName, usetStoryText, randomUserImageURL, picArray);
  localStorage.setItem('userStories', JSON.stringify(Story.storiesList));
  renderStories();
  event.target.reset();
}

const trimImageURL = function(picArray){
  const picList = [];
  picArray.forEach( picURL =>{
    if(picURL !== '')
      picList.push(picURL);
  });
  return picList;
}


function Story(name, storyText, imgPath, picArray) {
  this.name = name;
  this.imgPath = imgPath;
  this.storyText = storyText;
  this.picArray=picArray;
  Story.storiesList.push(this);
}

Story.storiesList = [];


const clearStories = function () {
  document.querySelector('.users-stories-container').innerHTML = '';
};


const loadStorage = function () {
  Story.storiesList = JSON.parse(localStorage.getItem('userStories')) || [];
};


const storyTextContainer = document.createElement('div');
const storyUserGallary = document.createElement('div');


const renderStories = function () {
  clearStories();
  loadStorage();
  const userStoriesContainer = document.querySelector('.users-stories-container');
  for (let i = Story.storiesList.length - 1; i >= 0; i--) {
    const storyElement = document.createElement('div');
    const storyTextContainer = document.createElement('div');
    const userName = document.createElement('h3');
    const userImage = document.createElement('img');
    userImage.classList.add('img-story');
    const userStoryText = document.createElement('p');
    userName.textContent = Story.storiesList[i].name;
    userImage.src = Story.storiesList[i].imgPath;
    userStoryText.textContent = Story.storiesList[i].storyText;
    storyElement.classList.add('user-story');
    storyTextContainer.classList.add('story-text-container');
    storyTextContainer.appendChild(userName);
    storyTextContainer.appendChild(userStoryText);
    storyElement.appendChild(userImage);
    storyElement.appendChild(storyTextContainer);
    if (Story.storiesList[i].picArray.length) {
      const storyUserGallary = document.createElement('div');
      for (let j = 0; j < Story.storiesList[i].picArray.length; j++) {
        let appear = document.createElement('img');
        appear.setAttribute("src", Story.storiesList[i].picArray[j]);
        storyUserGallary.classList.add('fav-img');
        storyUserGallary.appendChild(appear);
      }
      storyElement.appendChild(storyUserGallary);
    }
    userStoriesContainer.appendChild(storyElement);
  }
};
document.querySelector('.story-form').addEventListener('submit', storySubmtionHandler);
renderStories();

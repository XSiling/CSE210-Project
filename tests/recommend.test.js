const { showLoadingGif, hideLoadingGif, fetchBasicInformation } = require('../src/components/recommendation.js');

const mockGetElementById = jest.fn();
document.getElementById = mockGetElementById;

document.createElement = jest.fn().mockImplementation((tag) => {
  return { setAttribute: jest.fn(), innerHTML: '' };
});

describe('showLoadingGif', () => {
  test('should create and append a loading gif to the container', () => {
    const fakeContainer = { innerHTML: '', appendChild: jest.fn() };
    mockGetElementById.mockReturnValueOnce(fakeContainer);

    showLoadingGif('someContainerId');

    expect(mockGetElementById).toHaveBeenCalledWith('someContainerId');
    expect(document.createElement).toHaveBeenCalledWith('img');
    expect(fakeContainer.appendChild).toHaveBeenCalled();
  });
});

describe('hideLoadingGif', () => {
  test('should remove the loading gif from the container', () => {
    const fakeLoadingGif = {};
    const fakeContainer = { removeChild: jest.fn() };
    mockGetElementById
      .mockReturnValueOnce(fakeContainer)
      .mockReturnValueOnce(fakeLoadingGif);

    hideLoadingGif('someContainerId');

    expect(mockGetElementById).toHaveBeenCalledWith('someContainerId');
    expect(fakeContainer.removeChild).toHaveBeenCalledWith(fakeLoadingGif);
  });
});

describe('fetchBasicInformation', () => {
  test('should display basic information', () => {
    const fakeUser = {
      username: 'testUser',
      interests: ['coding', 'music'],
      mastodonAccount: 'test@mastodon',
      profile_img: 'path/to/image'
    };

    const fakeElement = { innerHTML: '', setAttribute: jest.fn(), appendChild: jest.fn() };
    mockGetElementById.mockReturnValue(fakeElement);

    fetchBasicInformation(fakeUser);

    expect(fakeElement.innerHTML).not.toBe('');
  });
});

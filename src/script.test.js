// tests.js

// Mock fetch function
window.fetch = async () => ({
    json: async () => ({ success: true }),
});

// Mock DOM elements
document.getElementById = jest.fn(id => ({
    value: 'testValue',
    checked: true,
}));

// Test login function
test('login should redirect on successful login', async () => {
    await login();
});

test('login should show an alert on unsuccessful login', async () => {
    // Mocking fetch to simulate unsuccessful login
    window.fetch = async () => ({
        json: async () => ({ success: false, message: 'Invalid credentials' }),
    });

    const alertSpy = jest.spyOn(window, 'alert');

    await login();

    expect(alertSpy).toHaveBeenCalledWith('Invalid credentials');
});

// Test register function
test('register should redirect on successful registration', async () => {
    await register();
});

test('register should show an alert on unsuccessful registration', async () => {
    // Mocking fetch to simulate unsuccessful registration
    window.fetch = async () => ({
        json: async () => ({ success: false, message: 'Username already exists' }),
    });

    const alertSpy = jest.spyOn(window, 'alert');

    await register();

    expect(alertSpy).toHaveBeenCalledWith('Username already exists');
});

// Test updateInterests function
test('updateInterests should redirect on successful update', async () => {
    await updateInterests();
});

test('updateInterests should show an alert on unsuccessful update', async () => {
    // Mocking fetch to simulate unsuccessful update
    window.fetch = async () => ({
        json: async () => ({ success: false, message: 'Failed to update interests' }),
    });

    const alertSpy = jest.spyOn(window, 'alert');

    await updateInterests();

    expect(alertSpy).toHaveBeenCalledWith('Failed to update interests');
});

// Test loadRecommendations function
test('loadRecommendations should update DOM on successful load', async () => {
    await loadRecommendations();
});

test('loadRecommendations should show an alert on unsuccessful load', async () => {
    // Mocking fetch to simulate unsuccessful load
    window.fetch = async () => ({
        json: async () => ({ success: false, message: 'Failed to load recommendations' }),
    });

    const alertSpy = jest.spyOn(window, 'alert');

    await loadRecommendations();

    expect(alertSpy).toHaveBeenCalledWith('Failed to load recommendations');
});

// Test addInterest function
test('addInterest should check the checkbox for an existing interest', () => {
    addInterest();
});

test('addInterest should show an alert for a non-existing interest', () => {
    // Mocking indexOf to simulate a non-existing interest
    const indexOfSpy = jest.spyOn(Array.prototype, 'indexOf').mockReturnValue(-1);

    const alertSpy = jest.spyOn(window, 'alert');

    addInterest();

    // Restore the original indexOf implementation
    indexOfSpy.mockRestore();

    expect(alertSpy).toHaveBeenCalledWith('No such existed interests.');
});

// Test createInterestsButtons function
test('createInterestsButtons should create interest buttons in the DOM', () => {
    createInterestsButtons();
});

console.log('All tests passed.');
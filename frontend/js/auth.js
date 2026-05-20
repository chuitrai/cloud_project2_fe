document.getElementById('authForm')?.addEventListener('submit', function(e) {
    e.preventDefault(); // Chặn việc tự động reload trang
    
    // MOCK DATA: Chỗ này giả vờ là đã gọi Cognito và lấy được token
    const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5c..."; 
    localStorage.setItem('userToken', fakeToken);
    
    // Chuyển hướng sang trang làm việc
    window.location.href = "index.html";
});

function logout() {
    localStorage.removeItem('userToken');
    window.location.href = "login.html";
}
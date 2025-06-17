// Initialize default data if not exists
function initializeData() {
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            {
                id: 1,
                username: 'instructor',
                email: 'instructor@example.com',
                password: 'instructor123',
                role: 'instructor'
            },
            {
                id: 2,
                username: 'student',
                email: 'student@example.com',
                password: 'student123',
                role: 'student'
            }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    
    // Check authentication on all pages except login and index
    if (!window.location.pathname.includes('login.html') && 
        !window.location.pathname.includes('index.html')) {
        checkAuth();
    }
    
    // Add enroll button to course page if user is a student
    if (window.location.pathname.includes('course.html')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = parseInt(urlParams.get('id'));
        
        if (currentUser?.role === 'student') {
            const enrollments = JSON.parse(localStorage.getItem('enrollments'));
            const isEnrolled = enrollments.some(e => e.studentId === currentUser.id && e.courseId === courseId);
            
            if (!isEnrolled) {
                const enrollBtn = document.createElement('button');
                enrollBtn.className = 'btn';
                enrollBtn.textContent = 'Enroll in Course';
                enrollBtn.onclick = () => enrollInCourse(courseId);
                document.querySelector('.course-view').appendChild(enrollBtn);
            }
        }
    }
});
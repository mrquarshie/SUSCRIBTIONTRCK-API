// Initialize courses if not exists
if (!localStorage.getItem('courses')) {
    const defaultCourses = [
        {
            id: 1,
            title: 'Introduction to JavaScript',
            description: 'Learn the basics of JavaScript programming',
            instructorId: 1,
            content: [
                { id: 1, title: 'Getting Started', type: 'document', file: 'intro.pdf' },
                { id: 2, title: 'Variables and Data Types', type: 'video', file: 'https://youtube.com/embed/example' }
            ]
        },
        {
            id: 2,
            title: 'Web Development Fundamentals',
            description: 'Learn HTML, CSS, and basic web concepts',
            instructorId: 1,
            content: [
                { id: 1, title: 'HTML Basics', type: 'document', file: 'html-basics.pdf' }
            ]
        }
    ];
    localStorage.setItem('courses', JSON.stringify(defaultCourses));
}

// Initialize enrollments if not exists
if (!localStorage.getItem('enrollments')) {
    localStorage.setItem('enrollments', JSON.stringify([]));
}

// Load featured courses on homepage
if (document.getElementById('featured-courses')) {
    const courses = JSON.parse(localStorage.getItem('courses'));
    const featuredContainer = document.getElementById('featured-courses');
    
    courses.slice(0, 3).forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <a href="course.html?id=${course.id}" class="btn">View Course</a>
        `;
        featuredContainer.appendChild(courseCard);
    });
}

// Load user courses on dashboard
if (document.getElementById('user-courses')) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const courses = JSON.parse(localStorage.getItem('courses'));
    const enrollments = JSON.parse(localStorage.getItem('enrollments'));
    
    const userEnrollments = enrollments.filter(e => e.studentId === currentUser.id);
    const userCourses = userEnrollments.map(e => {
        return courses.find(c => c.id === e.courseId);
    });
    
    const userCoursesContainer = document.getElementById('user-courses');
    
    if (userCourses.length > 0) {
        userCourses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';
            courseCard.innerHTML = `
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <a href="course.html?id=${course.id}" class="btn">Continue Learning</a>
            `;
            userCoursesContainer.appendChild(courseCard);
        });
    } else {
        userCoursesContainer.innerHTML = '<p>You are not enrolled in any courses yet.</p>';
    }
}

// Create new course
document.getElementById('create-course-btn')?.addEventListener('click', function() {
    document.getElementById('course-creation-form').style.display = 'block';
});

document.getElementById('new-course-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const title = document.getElementById('course-title').value;
    const description = document.getElementById('course-description').value;
    
    const courses = JSON.parse(localStorage.getItem('courses'));
    const newCourse = {
        id: Date.now(),
        title,
        description,
        instructorId: currentUser.id,
        content: []
    };
    
    courses.push(newCourse);
    localStorage.setItem('courses', JSON.stringify(courses));
    alert('Course created successfully!');
    window.location.reload();
});

// Load course details
if (window.location.pathname.includes('course.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = parseInt(urlParams.get('id'));
    
    const courses = JSON.parse(localStorage.getItem('courses'));
    const course = courses.find(c => c.id === courseId);
    
    if (course) {
        document.getElementById('course-title').textContent = course.title;
        document.getElementById('course-description').textContent = course.description;
        
        // Get instructor name
        const users = JSON.parse(localStorage.getItem('users'));
        const instructor = users.find(u => u.id === course.instructorId);
        document.getElementById('course-instructor').textContent += instructor?.username || 'Unknown';
        
        // Load content
        const contentList = document.getElementById('content-list');
        course.content.forEach(item => {
            const contentItem = document.createElement('div');
            contentItem.className = 'content-item';
            contentItem.innerHTML = `
                <h4>${item.title}</h4>
                <p>Type: ${item.type}</p>
                ${item.type === 'video' ? 
                    `<iframe width="560" height="315" src="${item.file}" frameborder="0" allowfullscreen></iframe>` :
                    `<a href="${item.file}" target="_blank">View ${item.type}</a>`
                }
            `;
            contentList.appendChild(contentItem);
        });
        
        // Check if current user is the instructor
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser?.id === course.instructorId) {
            document.getElementById('instructor-course-actions').style.display = 'block';
        }
    } else {
        alert('Course not found');
        window.location.href = 'dashboard.html';
    }
}

// Add content to course
document.getElementById('add-content-btn')?.addEventListener('click', function() {
    document.getElementById('content-creation-form').style.display = 'block';
});

document.getElementById('new-content-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = parseInt(urlParams.get('id'));
    
    const title = document.getElementById('content-title').value;
    const type = document.getElementById('content-type').value;
    const file = document.getElementById('content-file').value;
    
    const courses = JSON.parse(localStorage.getItem('courses'));
    const course = courses.find(c => c.id === courseId);
    
    if (course) {
        course.content.push({
            id: Date.now(),
            title,
            type,
            file
        });
        
        localStorage.setItem('courses', JSON.stringify(courses));
        alert('Content added successfully!');
        window.location.reload();
    }
});

// Enroll in course
function enrollInCourse(courseId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login to enroll in courses');
        window.location.href = 'login.html';
        return;
    }
    
    const enrollments = JSON.parse(localStorage.getItem('enrollments'));
    
    // Check if already enrolled
    if (enrollments.some(e => e.studentId === currentUser.id && e.courseId === courseId)) {
        alert('You are already enrolled in this course');
        return;
    }
    
    enrollments.push({
        id: Date.now(),
        studentId: currentUser.id,
        courseId,
        enrollmentDate: new Date().toISOString(),
        completionStatus: 'in-progress'
    });
    
    localStorage.setItem('enrollments', JSON.stringify(enrollments));
    alert('Enrolled successfully!');
    window.location.href = 'dashboard.html';
}
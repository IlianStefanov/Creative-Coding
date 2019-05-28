{
    class Revealer {
        constructor(el, options) {
            this.options = {
                angle: 0,
            };
            Object.assign(this.options, options);

            this.DOM = {};
            this.DOM.el = el;
            this.DOM.inner = this.DOM.el.firstElementChild;

            this.DOM.inner.style.width = 
            `calc(100vw * ${Math.abs(Math.cos(this.options.angle * Math.PI / 180))} + 100vh * ${Math.abs(Math.sin(this.options.angle * Math.PI / 180))})`;
            this.DOM.inner.style.height = 
            `calc(100vw * ${Math.abs(Math.sin(this.options.angle * Math.PI / 180))} + 100vh * ${Math.abs(Math.cos(this.options.angle * Math.PI / 180))})`;
            console.info("REVEALER INNER: ", this.DOM.inner);
            console.info("REVEALER EL: ", this.DOM.el);
            this.DOM.el.style.transform = `rotate3d(0,0,1,${this.options.angle}deg)`;

            this.DOM.reverse = this.DOM.inner.querySelector('.content__reverse');
            if(this.DOM.reverse) {
                TweenMax.set(this.DOM.reverse, { rotation: -1 * this.options.angle });
            }
        }
    }
    // GLOBAL VARIABLES
    const easing = Expo.easeInOut;
    const defaultDuration = 1.2;

    // Content elements
    const content = {
        first: document.querySelector('.content--first'),
        second: document.querySelector('.content--second')
    }

    const firstPageContent = {
        img: content.first.querySelector('.intro__img'),
        title: content.first.querySelector('.intro__title'),
        enter: content.first.querySelector('.intro__enter'),
        // About page
        aboutMeSlide: content.first.querySelector('.about__me__slide'),
        aboutMeTitle: content.first.querySelector('.about__me__title'),
        aboutMeTextWeb: content.first.querySelector('.about__me__texteffect_wrapper'),
        aboutMeSocialLinks: content.first.querySelector('.social-connections'),
        downloadCVButton: content.first.querySelector('.download-btn'),
        skillsReveal: content.first.querySelector('.skills-btn-reveal')
    }

    const links = {
        all: document.querySelector('.navigation__buttons'),
        aboutMe: document.querySelector('.about__me__link'),
        skills: document.querySelector('.skillset__link'),
        introLink: document.querySelector('.intro__link')
    };

    // Splitting letters for the firstPageContent.title element (just adding a bit more feeling to it)
    charming(firstPageContent.title);
    firstPageContent.titleLetters = [...firstPageContent.title.querySelectorAll('span')];
    console.log(firstPageContent.titleLetters);
    firstPageContent.titleLetters.sort(() => Math.round(Math.random())-0.5);
    
    // some random letters
    let letters = firstPageContent.titleLetters.filter(_ => Math.random() < .5);
    console.log(letters);
    // remaining
    let otherletters = firstPageContent.titleLetters.filter(el => letters.indexOf(el) < 0);


    // Second page's content.
    const secondPageContent = {
        reel: content.second.querySelector('.reel'),
        text: content.second.querySelector('.content__text'),
        selectElems: content.second.querySelectorAll('.select > *'),
        backCtrl: content.second.querySelector('.content__back')
    };

    // Revealer element
    const revealer = new Revealer(content.first, { angle: 110 });

    // Animate things: show revealer animation, animate first page elements out (optional) and animate second page elements in (optional)
    const showNextPage = () => {
        // Pointer events related class
        content.first.classList.add('content--hidden');

        const ease = Expo.easeInOut;
        const duration = 1.2;

        this.pageToggleTimeline = new TimelineMax()
        // Animate first page elements (optional)
        .to(firstPageContent.img, duration, {
            ease: ease,
            x: 250,
            y: -50,
            rotation: -10,
            opacity: 0
        }, 0)
        .staggerTo(otherletters, duration*0.8, {
            ease: ease,
            x: 100,
            opacity: 0
        }, 0.04, 0)
        .to(firstPageContent.enter, duration*0.5, {
            ease: ease,
            opacity: 0
        }, 0)
        
        // "Unreveal effect" (inner moves to one direction and reverse moves to the opposite one)
        .to(revealer.DOM.el, duration, {
            ease: ease,
            rotation: '-=40'
        }, 0)
        .to(revealer.DOM.inner, duration, {
            ease: ease,
            y: '-100%'
        }, 0)
        .to(revealer.DOM.reverse, duration, {
            ease: ease,
            rotation: '-=-40',
            y: '100%'
        }, 0)

        // Animate second page elements (optional)
        .to(secondPageContent.reel, duration, {
            ease: ease,
            startAt: {x: -50},
            x: 0
        }, 0)
        .to(secondPageContent.text, duration, {
            ease: ease,
            startAt: {x: -300, y: -10, rotation: 5},
            x: 0,
            y: 0, 
            rotation: 0
        }, 0)
        .set(secondPageContent.selectElems, {opacity: 0}, 0)
        .staggerTo(secondPageContent.selectElems, duration*0.7, {
            ease: Expo.easeOut,
            startAt: {x: -150},
            opacity: 1,
            x: 0
        }, 0.03, 0.5);

        console.info("Page Toggle Timeline: ", this.pageToggleTimeline);
    }
    



    
    firstPageContent.enter.addEventListener('click', showNextPage);
    // const revealer2 = new Revealer(content.first, { angle: 110 });

    // const showNextRevealEffect = () => {
    //     content.first.classList.add('content--hidden');

    //     const ease = Expo.easeInOut;
    //     const duration = 1.2;

    //     this.pageToggleTimeline2 = new TimelineMax()
    //     // "Unreveal effect" (inner moves to one direction and reverse moves to the opposite one)
    //     .to(revealer.DOM.el, duration, {
    //         ease: ease,
    //         rotation: '-=40'
    //     }, 0)
    //     .to(revealer.DOM.inner, duration, {
    //         ease: ease,
    //         y: '-100%'
    //     }, 0)
    //     .to(revealer.DOM.reverse, duration, {
    //         ease: ease,
    //         rotation: '-=-40',
    //         y: '100%'
    //     }, 0);
    // }
    // firstPageContent.downloadCVButton.addEventListener('click', showNextRevealEffect);


    // Animate back
    const showIntro = () => {
        // Pointer events related class
        content.first.classList.remove('content--hidden');
        this.pageToggleTimeline.reverse();
    };

    secondPageContent.backCtrl.addEventListener('click', showIntro);

    // Hover animation on the intro "enter" element
    let enterHoverAnimationRunning = false;
    const onEnterHoverFn = () => {
        if(enterHoverAnimationRunning) {
            return false;
        }
        enterHoverAnimationRunning = true; 

        letters = firstPageContent.titleLetters.filter(_ => Math.random() < .5);
        otherletters = firstPageContent.titleLetters.filter(el => letters.indexOf(el) < 0);
        new TimelineMax({ onComplete: () => enterHoverAnimationRunning = false })
        .staggerTo(letters, 0.2, {
            ease: Quad.easIn, 
            x: "50%",
            opacity: 0
        }, 0.04, 0)
        .staggerTo(letters, 0.6, {
            ease: Quint.easeOut,
            startAt: { x: '-35%' },
            x: '0%',
            opacity: 1
        },  0.04, 0.2);
    };
    firstPageContent.enter.addEventListener('mouseenter', onEnterHoverFn);
    // Hover animation on the intro "enter" element END



    // SHOW ABOUT PAGE SLIDE

    const showAboutPage = () => {
        links.aboutMe.classList.add('active');

        // remove other links active class
        links.skills.classList.remove('active');
        links.introLink.classList.remove('active');

        

        this.hideIntro = new TimelineMax()
        .to(firstPageContent.img, defaultDuration, {
            ease: easing,
            x: -250,
            // y: -50,
            // rotation: -10,
            opacity: 0
        }, 0)
        .to(firstPageContent.title, defaultDuration, {
            ease: easing,
            x: 100,
            opacity: 0
        }, 0)
        .to(firstPageContent.enter, defaultDuration, {
            ease: easing,
            y: -20,
            opacity: 0
        }, 0) // SHOW ABOUT PAGE
        .fromTo(firstPageContent.aboutMeSlide, defaultDuration, {
            ease: easing,
            opacity: 0,
            x: 0
        }, {x: 0, opacity: 1},  1)
        .staggerTo(firstPageContent.aboutMeSocialLinks.children, defaultDuration, {
            opacity: 1,
            
        }, .2, 1)
        .to(firstPageContent.skillsReveal, defaultDuration, {
            startAt: { opacity: 0 }, 
            opacity: 1 
        }, 2)
        .to(firstPageContent.downloadCVButton, defaultDuration, {
            opacity: 1,
        }, 1)
        // .staggerTo(firstPageContent.aboutMeSocialLinks.children, defaultDuration, {
        //     opacity: 1,
        //     y: 0
        // }, .2, 0.8)
        .to(firstPageContent.aboutMeTitle, defaultDuration, 
            {
                startAt: { x: '-10px', opacity: 0},
                x: 0,
                opacity: 1
            }, 1
        )
        .to(firstPageContent.aboutMeTextWeb, defaultDuration, 
            {
                startAt: { y: '-10px', opacity: 0},
                y: 0,
                opacity: 1
            }, 1
        )
        .to(firstPageContent.img, defaultDuration, {
            x: 0,
            opacity: 0
        }, 1)
        .to(firstPageContent.img, defaultDuration, {
            opacity: 0.5
        }, 2);

        firstPageContent.aboutMeSlide.classList.replace('inactive', 'active');
    };
    // Bind function with event listener
    links.aboutMe.addEventListener('click', showAboutPage);

    const backToIntro = () => {
        // firstPageContent.aboutMeSlide.classList.replace('active', 'inactive');
        // firstPageContent.aboutMeSlide.classList.remove('active');
        // Intro is active 
        
        links.introLink.classList.add('active');

        // OTHER LINKS SHOUD BE SET BACK TO NORMAL STATE
        links.aboutMe.classList.remove('active');
        links.skills.classList.remove('active');

        this.backtoIntro_aboutTimeline = new TimelineMax()
        .to(firstPageContent.aboutMeSlide, defaultDuration, {
            ease: easing,
            opacity: 0,
            // y: -20
        }, 0.1)
        .to(firstPageContent.img, defaultDuration, {
            x: 0, 
            opacity: 0.5
        });
        
        this.hideIntro.reverse();
        
        setTimeout(() => {
            firstPageContent.aboutMeSlide.classList.replace('active', 'inactive');
        }, 1000);
    }

    links.introLink.addEventListener('click', backToIntro);

    const showSkillsSlide = () => {
        
        links.skills.classList.add('active');

        // remove other links active class
        links.aboutMe.classList.remove('active');
    };

    links.skills.addEventListener('click', showSkillsSlide);


}
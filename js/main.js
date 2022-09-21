
function init(){

    // welcome to the projects gallery
    gsap.set('.projects', {autoAlpha: 1})
    gsap.set('.project', {x: '-100%'})

    let currentStep = 0;
    let totalSlides = document.querySelectorAll('.project').length
    const wrapper = gsap.utils.wrap(0, totalSlides)

    createTimelineIn('next', currentStep)

    function createTimelineIn(direction, index) {

        const goPrev = direction === 'prev'

        const element = document.querySelector('div.project0' + index)
            projectClasses = element.className.split(' ')
            projectClass = projectClasses[1]
            title = element.querySelector('.project-title')
            subtitle = element.querySelector('.project-subtitle')
            button = element.querySelector('.button-container')

        const tlIn = gsap.timeline({
            id: 'tlIn',
            defaults: {
                modifiers: {
                    x: gsap.utils.unitize(function(x) {
                        console.log({x}, {xF: Math.abs(x)})
                        return goPrev ? Math.abs(x) : x
                    })
                }
            }
        })
        tlIn.fromTo(element, {
            autoAlpha: 0, x: "-100%"
        }, 
        {
            duration: 0.6, 
            ease: Power4.out,
            x: 0, 
            autoAlpha: 1,
            onStart: updateClass,
            onStartParams: [projectClass],
        })
        .from([title, subtitle, button], {
            duration: 0.2, 
            autoAlpha: 0,
            x: -20,
            stagger: 0.08,
        })
    

        return tlIn
    }

    function createTimelineOut(direction, index) {

        const goPrev = direction === 'prev'

        const element = document.querySelector('div.project0' + index)

        const tlOut = gsap.timeline()
        tlOut.to(element, {
            duration: 0.7, 
            x: 250, 
            autoAlpha: 0,
            modifiers: {
                x: gsap.utils.unitize(function(x) {
                    console.log({x}, {xF: Math.abs(x)})
                    return goPrev ? -x : x
                })
            },
            ease: 'back.in(2)'
        })

        return tlOut
    }

    function isTweening() {
        return gsap.isTweening('.project')
    }

    document.querySelector('button.next').addEventListener('click', (event) => {
        event.preventDefault()


        const nextStep = wrapper(currentStep + 1)


        !isTweening() && transition("next", nextStep)
    })

    document.querySelector('button.prev').addEventListener('click', (event) => {
        event.preventDefault()

        const prevStep = wrapper(currentStep - 1)

        !isTweening() && transition("prev", prevStep)
    })


    function updateClass() {
        document.querySelector('body').className = projectClass
    }

    function updateCurrentStep(goToIndex) {

        currentStep = goToIndex

        document.querySelectorAll('.dot').forEach(function (element, index) {
            element.setAttribute('class', 'dot')
            if (index === currentStep) {
                element.classList.add('active')
            }
        })
        positionDot()

    }

    function transition(direction, toIndex) {

        const tlTransition = gsap.timeline({
            onStart: () => {
                console.log({fromIndex: currentStep}, {toIndex})
                updateCurrentStep(toIndex)
            }
        })

        const tlOut = createTimelineOut(direction, currentStep)
        const tlIn = createTimelineIn(direction, toIndex)

        tlTransition
            .add(tlOut)
            .add(tlIn)

        return tlTransition
    }   

    function createNavigation() {

        // Create dots container
        const newDiv = document.createElement('div')
        newDiv.setAttribute('class', 'dots')

        // Add active dot
        const spot = document.createElement('div')
        spot.setAttribute('class', 'spot')


        // create a dot for each slide
        for (let index = 0; index < totalSlides; index++) {
            const element = document.createElement('button')
            const text = document.createTextNode(index)
            element.appendChild(text)
            element.setAttribute('class', 'dot')
            if (currentStep === index) {
                element.classList.add('active')
            }

            element.addEventListener('click', () => {
                if (!isTweening()) {
                    const direction = index > currentStep ? 'next' : 'prev'
                    transition(direction, index)
                }
            })

            newDiv.appendChild(element)
        }

        // Add dots to project container
        newDiv.appendChild(spot)
        document.querySelector('.projects').appendChild(newDiv)
        positionDot()

    }

    function positionDot() {

        const activeDotX = document.querySelector('.dot.active').offsetLeft
        const spot = document.querySelector('.spot')
        const spotX = spot.offsetLeft
        const destinationX = Math.round(activeDotX - spotX + 5)

        const dotTl = gsap.timeline()
            dotTl
            .to(spot, {
                duration: 0.4,
                x: destinationX,
                scale: 2.5,
                ease: 'power1.Out',
            })
            .to(spot, {
                duration: 0.2,
                scale: 1,
                ease: 'power1.in',
            })

    }
    createNavigation()
}

window.addEventListener('load', function(){
    init();
});

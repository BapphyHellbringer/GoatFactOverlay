const loginContainer = document.querySelector('.loginContainer');
const factContainer = document.querySelector('.factContainer');
const factsDisplay = document.querySelector('.goatFacts');
const loginForm = document.querySelector('#login');
const username = document.querySelector('#username');
const animationIn = 'animate__bounceInUp';
const animationOut = 'animate__bounceOutUp';
const goatFactAPI = 'https://goatops.farm/api/v1/creatures/goat/random-facts?n=1';


//LOGIN
    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        login();
    });

    function login(){
        ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
            goatCommands(command);
        }
        
        ComfyJS.Init(username.value);

        loginAnimation();
    }

    function loginAnimation(){
        loginContainer.classList.add(animationOut);

        loginContainer.addEventListener('animationend', () => {
                loginContainer.classList.add('hide');
                factContainer.classList.remove('hide');
            }
        )
    }


//CHAT COMMANDS  
    async function goatCommands(command){
        switch(command){ 
            case 'goatfact':
                await newGoatFact();
                break;
        }
    }


//GOAT FACTS
    async function getGoatFact(){                       //Holt den Ziegenfakt
    try {
        const response = await fetch(goatFactAPI);

        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();

        return result.facts[0];

        } catch (error) {
            console.error(error.message);
        }
    }

    async function newGoatFact(){                       //Checkt ob schon n Fakt da ist, löscht ihn wenn ja, bevor der neue Fakt kommt. Sonst kommt der neue Fakt so.
        let goatFact = document.querySelector('.goatFact');

        if(goatFact){
            await deleteGoatFact(goatFact);
        }

        goatFact = await buildFactHTML();
        window.setTimeout( () => deleteGoatFact(goatFact), 30000);
    }

    async function buildFactHTML(){                     //Baut das HTML für den Ziegenfakt zusammen und zeigt es an
        let fact = await getGoatFact();
        let goatFactHTML = `<div class="animate__animated ${animationIn} goatFact dots">
                                <p class="title">Goat Wisdom</p>
                                <p class="fact">${fact}</p>
                            </div>`;
        factsDisplay.innerHTML = goatFactHTML;
        goatFactElement = document.querySelector('.goatFact');
        goatFactElement.addEventListener('animationend', () => {
            goatFactElement.classList.remove(animationIn)
        });

        return goatFactElement;
    }

    function deleteGoatFact(factToDelete){              //Macht den Ziegenfakt weg
        return new Promise((resolve) => {
            factToDelete.classList.add(animationOut);
            factToDelete.addEventListener('animationend', () => {
                factsDisplay.innerHTML = '';
                resolve();
            });
        });
    }
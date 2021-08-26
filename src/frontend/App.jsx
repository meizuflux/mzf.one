import "./curves.css"

import { createSignal } from "solid-js"

function App() {
    const [created, setCreated] = createSignal([])
    const [valid, setValid] = createSignal(true)

    const re = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z{00a1}{ffff}0-9]+-?)*[a-z{00a1}{ffff}0-9]+)(?:\.(?:[a-z{00a1}{ffff}0-9]+-?)*[a-z{00a1}{ffff}0-9]+)*(?:\.(?:[a-z{00a1}{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/

    let url
    const key = "1234"

    const registerUrl = (e) => {
        e.preventDefault()

        if (!valid) {
            return
        }

        
        setCreated([...created(), "mzf.one/" + key])
        console.log(created())
    }

    return (
        <div class="container">

            <h1 class="main-title no-margin">
                mzf.one
            </h1>
            <p class="secondary-text no-margin">
                A simple, privacy respecting url shortner
            </p>

            <div class="inputer">
                <div>
                    <form onSubmit={registerUrl}>
                        <input class="url" type="text" ref={url} placeholder="https://example.com" onChange={() => setValid(url.value.match(re))}/>
                        <button class="submit-button" type="submit">Shorten</button>
                        {!valid() ? <p>Please enter a valid URL.</p> : ""}
                    </form>
                </div>
            </div>
            

        </div>
        
    );
}

export default App
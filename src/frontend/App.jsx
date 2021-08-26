import { createSignal, createEffect } from "solid-js"

function App() {
    const [created, setCreated] = createSignal([])
    const [valid, setValid] = createSignal(true)

    const re = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z{00a1}{ffff}0-9]+-?)*[a-z{00a1}{ffff}0-9]+)(?:\.(?:[a-z{00a1}{ffff}0-9]+-?)*[a-z{00a1}{ffff}0-9]+)*(?:\.(?:[a-z{00a1}{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/

    let url
    const key = "1234"

    const registerUrl = (e) => {
        e.preventDefault()

        let temp = url.value

        if (!temp.startsWith("https://") || !temp.startsWith("http://")) {
            temp = "http://" + temp
        }

        if (!temp.match(re)) {
            setValid(false)
            return
        }

        setCreated([...created(), "mzf.one/" + key])
        if (valid() == false) {
            setValid(true)
        }
    }

    return (
        <div class="container-lg">
            <div class="row d-flex justify-content-center">
                <div class="col-md-6 text-center">
                    <h1 class="">
                        mzf.one
                    </h1>
                    <p class="">
                        A simple, privacy respecting url shortner
                    </p>

                    <form onSubmit={registerUrl}>
                        <div class="input-group mb-3">
                            <input type="text" class={`form-control${valid() == false ? ' is-invalid' : ""}`} id="floatingInputInvalid" placeholder="https://example.com" ref={url} />
                            <button class="btn btn-outline-primary" type="submit">Shorten</button>
                        </div>
                    </form>

                    <div class="container shadow p-3 mb-5 bg-white rounded">
                        <div class="row align-items-center">
                            <div class="col">
                                https://google.com
                            </div>
                            <div class="col" style="border-right: 2px solid black; border-left: 2px solid black;">
                                <a href="/1234">mzf.one/1234</a>
                            </div>
                            <div class="col align-items-right">
                                <button class="btn btn-primary">Copy</button>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
            </div>

            
            

        </div>
        
    );
}

export default App
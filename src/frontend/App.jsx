import { createSignal, createEffect } from "solid-js"

function App() {
    const [created, setCreated] = createSignal([])
    const [valid, setValid] = createSignal(true)

    const re = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z{00a1}{ffff}0-9]+-?)*[a-z{00a1}{ffff}0-9]+)(?:\.(?:[a-z{00a1}{ffff}0-9]+-?)*[a-z{00a1}{ffff}0-9]+)*(?:\.(?:[a-z{00a1}{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/

    let url
    const key = "1234"
    const domain = "https://mzf.one/"

    const registerUrl = async (e) => {
        e.preventDefault()

        let temp = url.value

        if ((!(temp.startsWith("https://") || temp.startsWith("http://")))) {
            temp = "http://" + temp
        }

        if (!temp.match(re)) {
            setValid(false)
            return
        }

        fetch("http://localhost:8080/set", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({url: temp})
        })
        .then(resp => resp.json())
        .then(data => {
            setCreated([{url: temp, key: data.key}, ...created()])
            if (valid() == false) {
                setValid(true)
            }
        })

        
    }

    const copy = (txt, id) => {
        const el = document.createElement('textarea');
        el.value = txt;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        

        let btn = document.getElementById(id)
        btn.innerText = "Copied!"
        setTimeout(function() {
            btn.innerText = "Copy"
        }, 850)
    }

    const remove = (index) => {
        if (created().length == 1) {
            setCreated([])
            return
        }
        setCreated([...created().splice(index, 1)])
    }

    return (
        <>
            <div class="container-lg">
                <div class="row d-flex justify-content-center pt-5">
                    <div class="col-md-6 text-center pt-5">
                        <h1 class="display-1 mb-0 custom-font" style="font-weight: 400">
                            mzf.one
                        </h1>
                        <p class="lead custom-font" style="font-size: 1.5rem; font-weight: 400">
                            A simple, <a href="https://github.com/ppotatoo/rust-api" class="link-primary" style="text-decoration: none">open source</a> privacy respecting url shortner.
                        </p>

                        <form onSubmit={registerUrl}>
                            <div class="input-group mb-3">
                                <input type="text" class={`form-control${valid() == false ? ' is-invalid' : ""}`} id="floatingInputInvalid" placeholder="https://example.com" ref={url} />
                                <button class="btn btn-secondary" type="submit">Shorten</button>
                            </div>
                        </form>

                        {created().length == 0 ? null :
                        <div class="container p-3 mb-4 shadow rounded">
                            {created().map((item, index) => (
                                <div class={(index == created().length - 1) ? "" : "mb-3"}>
                                    <div class="row align-items-center">
                                        <div class="col">
                                            <a href={item.url}>{item.url}</a>
                                        </div>
                                        <div class="col" style="border-right: 2px solid black; border-left: 2px solid black;">
                                            <a href="/1234">{domain}{item.key}</a>
                                        </div>
                                        <div class="col">
                                            <button id={"c" + (index + 1).toString()} class="btn btn-secondary btn-sm mr-5" onClick={e => {copy(domain + item.key, "c" + (index + 1).toString())}}>Copy</button>
                                            <button class="btn btn-danger btn-sm" onClick={e => remove(index)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                        </div>}
                        
                    </div>
                    
                </div>

                
                

            </div>
        </>
    );
}

export default App
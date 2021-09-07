import { createSignal } from "solid-js"
import "./main.css"
import "bootstrap/dist/css/bootstrap.css";


function App() {
    const [created, setCreated] = createSignal([])
    const [valid, setValid] = createSignal(true)

    const re = new RegExp(/http(s)?:\/\/[-a-zA-Z0-9@:%_\+~#=]{1,256}\.[a-z]{2,6}[-a-zA-Z0-9@:%_\+.~#?&//=]*/)

    let url

    const registerUrl = async (e) => {
        e.preventDefault()

        let temp = url.value

        if (temp == "") {
            temp = "https://example.com"
        }

        if ((!(temp.startsWith("https://") || temp.startsWith("http://")))) {
            temp = "http://" + temp
        }

        if (!re.test(temp)) {
            setValid(false)
            return
        }

        fetch("/shorten", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({url: temp})
        })
        .then(resp => resp.json())
        .then(data => {
            setCreated([{url: temp, shortened: data.url}, ...created()])
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

    const truncate = (string, num) => {
        if (string.length <= num) {
            return string
        }
        return string.slice(0, num) + '...'
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
                            A simple, <a href="https://github.com/ppotatoo/mzf.one" class="link-primary" style="text-decoration: none">open source</a>, privacy respecting url shortner.
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
                                            <a href={item.url}>{truncate(item.url, 47)}</a>
                                        </div>
                                        <div class="col" style="border-right: 2px solid black; border-left: 2px solid black;">
                                            <a href={item.shortened}>{item.shortened}</a>
                                        </div>
                                        <div class="col">
                                            <button id={"c" + index.toString()} class="btn btn-secondary btn-sm mr-5" onClick={e => {copy(item.shortened, "c" + index.toString())}}>Copy</button>
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
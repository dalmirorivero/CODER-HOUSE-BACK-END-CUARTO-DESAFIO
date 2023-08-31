document.getElementById('login').addEventListener('click',(event)=> {
    event.preventDefault()
    const mail = document.getElementById('mail').value
    const password = document.getElementById('password').value
    console.log({ mail,password })
    fetch('/api/auth/sigin',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mail,password })
    })
        .then(res=>res.json())
        .then(res=>alert(res.message))
        .catch(err=>console.log(err))
})

document.getElementById('logout').addEventListener('click',(event)=> {
    event.preventDefault()
    fetch('/api/auth/sigout',{
        method: 'POST'
    })
        .then(res=>res.json())
        .then(res=>alert(res.message))
        .catch(err=>console.log(err))
})
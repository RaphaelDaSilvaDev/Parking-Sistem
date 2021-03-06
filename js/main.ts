interface Vehicle {
    name: string
    licensePlate: string
    register: Date | string
}

(function () {
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query)

    function calculateTime(miliseconds: number) {
        const hour = Math.floor(miliseconds / 3600000)
        const minute = Math.floor((miliseconds / 60000) % 60)
        const second = Math.floor((miliseconds / 1000) % 60)

        if (hour != 0) return `${hour}h e ${minute}m e ${second}s`
        if (minute != 0) return `${minute}m e ${second}s`
        if (second != 0) return `${second}s`

    }

    function courtyard() {
        function read(): Vehicle[] {
            return localStorage.courtyard ? JSON.parse(localStorage.courtyard) : []
        }

        function save(vehicles: Vehicle[]) {
            localStorage.setItem("courtyard", JSON.stringify(vehicles))
        }

        function add(vehicle: Vehicle, canSave?: boolean) {
            const row = document.createElement('div')
            row.classList.add('car')
            row.innerHTML = `
            <div class="name">
                <p>Carro:</p>
                <p>${vehicle.name}</p>
            </div>
            <span class="vertical-line"></span>
            <div class="licensePlate">
                <p>Placa:</p>
                <p>${vehicle.licensePlate}</p>
            </div>
            <span class="vertical-line"></span>
            <div class="register">
                <p>Entrada:</p>
                <p>${new Date(vehicle.register).toLocaleString("pt-BR", {
                hour: "numeric",
                minute: "numeric",
            })}</p>
            </div>
            <span class="vertical-line"></span>
            <div class="remove">
                <button id="delete" data-licenseplate="${vehicle.licensePlate}">X</button>
            </div>
            `
            row.querySelector('#delete')?.addEventListener("click", function () {
                remove(this.dataset.licenseplate)
            })

            $("#courtyard")?.appendChild(row)

            if (canSave) save([...read(), vehicle])
        }

        function remove(licensePlate: string) {
            const { register, name } = read().find(vehicle => vehicle.licensePlate === licensePlate)
            const totalTime = calculateTime(new Date().getTime() - new Date(register).getTime())

            if (
                !confirm(`O veiculo ${name} ${licensePlate} permanceu por ${totalTime}. Deseja retirar?`)) return

            save(read().filter((vehicle) => vehicle.licensePlate !== licensePlate))
            render()
        }

        function render() {
            $("#courtyard")!.innerHTML = ""
            const courtyard = read()

            if (courtyard.length) {
                courtyard.forEach((vehicle) => add(vehicle));
            }
        }

        return { read, add, remove, save, render }
    }

    courtyard().render()

    function validadeData(name: string, licensePlate: string): boolean {
        if (!name || !licensePlate) {
            alert("Todos os campos devem ser preenchidos!")
            return false
        }

        if (licensePlate.length != 8) {
            alert("Digite a placa da seguinte maneira abc-1234")
            return false
        }

        const verifyCarExist = courtyard().read().find(vehicle => vehicle.licensePlate === licensePlate)
        if (verifyCarExist) {
            alert(`O carro ${licensePlate} j?? est?? estacionado!`)
            return false
        }

        const validadeLicensePlate = licensePlate.split("-")

        if (validadeLicensePlate[0].length != 3) {
            alert("Digite a placa da seguinte maneira abc-1234")
            return false
        }

        for (let i = 0; i < validadeLicensePlate[0].length; i++) {
            const letters = validadeLicensePlate[0].split("")
            const pattern = "[a-zA-Z]"
            const makeTest = letters[i].match(pattern)
            if (makeTest === null) {
                alert("Os digitos da placa antes do - devem ser apenas letras")
                return false
            }
        }

        for (let i = 0; i < validadeLicensePlate[1].length; i++) {
            const letters = validadeLicensePlate[1].split("")
            if (i != 1) {
                const pattern = "[0-9]"
                const makeTest = letters[i].match(pattern)
                if (makeTest === null) {
                    alert("Os digitos da placa depois do - devem ser apenas letras, apenas o segundo depois do - pode ser letra")
                    return false
                }
            }

            if (i == 1) {
                const pattern = "[a-zA-Z0-9]"
                const makeTest = letters[i].match(pattern)
                if (makeTest === null) {
                    alert("A placa n??o pode conter caract??res especiais")
                    return false
                }
            }
        }

        return true

    }

    $("#register")?.addEventListener("click", () => {
        const name = $("#name")?.value
        const licensePlate = $("#license-plate")?.value.toUpperCase()

        const canAdd = validadeData(name, licensePlate)
        if (!canAdd) return

        courtyard().add({ name, licensePlate, register: new Date().toISOString() }, true)

        $("#name").value = ("")
        $("#license-plate").value = ("")
    })
})()
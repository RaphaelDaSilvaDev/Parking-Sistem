(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calculateTime(miliseconds) {
        const hour = Math.floor(miliseconds / 3600000);
        const minute = Math.floor((miliseconds / 60000) % 60);
        const second = Math.floor((miliseconds / 1000) % 60);
        if (hour != 0)
            return `${hour}h e ${minute}m e ${second}s`;
        if (minute != 0)
            return `${minute}m e ${second}s`;
        if (second != 0)
            return `${second}s`;
    }
    function courtyard() {
        function read() {
            return localStorage.courtyard ? JSON.parse(localStorage.courtyard) : [];
        }
        function save(vehicles) {
            localStorage.setItem("courtyard", JSON.stringify(vehicles));
        }
        function add(vehicle, canSave) {
            var _a, _b;
            const row = document.createElement('div');
            row.classList.add('car');
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
            `;
            (_a = row.querySelector('#delete')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remove(this.dataset.licenseplate);
            });
            (_b = $("#courtyard")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (canSave)
                save([...read(), vehicle]);
        }
        function remove(licensePlate) {
            const { register, name } = read().find(vehicle => vehicle.licensePlate === licensePlate);
            const totalTime = calculateTime(new Date().getTime() - new Date(register).getTime());
            if (!confirm(`O veiculo ${name} ${licensePlate} permanceu por ${totalTime}. Deseja retirar?`))
                return;
            save(read().filter((vehicle) => vehicle.licensePlate !== licensePlate));
            render();
        }
        function render() {
            $("#courtyard").innerHTML = "";
            const courtyard = read();
            if (courtyard.length) {
                courtyard.forEach((vehicle) => add(vehicle));
            }
        }
        return { read, add, remove, save, render };
    }
    courtyard().render();
    function validadeData(name, licensePlate) {
        if (!name || !licensePlate) {
            alert("Todos os campos devem ser preenchidos!");
            return false;
        }
        if (licensePlate.length != 8) {
            alert("Digite a placa da seguinte maneira abc-1234");
            return false;
        }
        const verifyCarExist = courtyard().read().find(vehicle => vehicle.licensePlate === licensePlate);
        if (verifyCarExist) {
            alert(`O carro ${licensePlate} já está estacionado!`);
            return false;
        }
        const validadeLicensePlate = licensePlate.split("-");
        if (validadeLicensePlate[0].length != 3) {
            alert("Digite a placa da seguinte maneira abc-1234");
            return false;
        }
        for (let i = 0; i < validadeLicensePlate[0].length; i++) {
            const letters = validadeLicensePlate[0].split("");
            const pattern = "[a-zA-Z]";
            const makeTest = letters[i].match(pattern);
            if (makeTest === null) {
                alert("Os digitos da placa antes do - devem ser apenas letras");
                return false;
            }
        }
        for (let i = 0; i < validadeLicensePlate[1].length; i++) {
            const letters = validadeLicensePlate[1].split("");
            if (i != 1) {
                const pattern = "[0-9]";
                const makeTest = letters[i].match(pattern);
                if (makeTest === null) {
                    alert("Os digitos da placa depois do - devem ser apenas letras, apenas o segundo depois do - pode ser letra");
                    return false;
                }
            }
            if (i == 1) {
                const pattern = "[a-zA-Z0-9]";
                const makeTest = letters[i].match(pattern);
                if (makeTest === null) {
                    alert("A placa não pode conter caractéres especiais");
                    return false;
                }
            }
        }
        return true;
    }
    (_a = $("#register")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const name = (_a = $("#name")) === null || _a === void 0 ? void 0 : _a.value;
        const licensePlate = (_b = $("#license-plate")) === null || _b === void 0 ? void 0 : _b.value.toUpperCase();
        const canAdd = validadeData(name, licensePlate);
        if (!canAdd)
            return;
        courtyard().add({ name, licensePlate, register: new Date().toISOString() }, true);
        $("#name").value = ("");
        $("#license-plate").value = ("");
    });
})();

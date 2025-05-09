document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const formulario = document.getElementById('formulario-agendamento');
    const dataSelecionada = document.getElementById('data');
    const horarioSelecionado = document.getElementById('horario');
    const divConfirmacao = document.getElementById('confirmacao');
    const resumoAgendamento = document.getElementById('resumo-agendamento');
    const buttonNovoAgendamento = document.getElementById('novo-agendamento');


    // Array de horarios disponiveis, simulando o servidor
    const horariosDisponiveis = {
        'manhã': ['09:00','09:30','10:00','10:30','11:00', '11:30'],
        'tarde': ['14:00', '14:30','15:00','15:30','16:00','16:30'],
    }

    // Pegando a data de hoje em uma variavel em seguida converte a data minima
    const hoje = new Date();
    const dataMinima = hoje.toISOString().split('T')[0];
    dataSelecionada.setAttribute('min', dataMinima);

    // Determinando a data maxima de agendamento para 3 meses
    const dataMaxima = new Date();
    dataMaxima.setMonth(hoje.getMonth() + 3);
    dataSelecionada.setAttribute('max', dataMaxima.toISOString().split('T')[0]);

    dataSelecionada.addEventListener('change', function () {
        horarioSelecionado.innerHTML = '';

        // verificação da validade das datas
        if (this.value) {
            const dataEscolhida = new Date(this.value);
            // Coleta a data escolhida para validação
            const diaSemana = dataEscolhida.getDay();
            
            if (diaSemana === 0 || diaSemana ===6) {
                alert('Não realizamos atendimentos aos sábados e domingos. Escolha outra data')
                this.value = ''
                return;
            }
            // Libera s seleção de horarios apos confirmar a data
            const optionPadrao = document.createElement('option');
            optionPadrao.value = '';
            optionPadrao.textContent = 'Selecione um horário';
            horarioSelecionado.appendChild(optionPadrao);

            // Apos os horarios serem liberados apos a confirmação da data, percorreremos os horarios no array horariosDisponiveis para adicionar horarios da manhã
            const grupoManha = document.createElement('optgroup');
            grupoManha.label = 'Manhã';
            horariosDisponiveis.manhã.forEach(horario => {
                const opcao = document.createElement('option');
                opcao.value = horario;
                opcao.textContent = horario;
                grupoManha.appendChild(opcao)
            })
            horarioSelecionado.appendChild(grupoManha);
            // Fazemos o mesmo processo para adicionar os horarios da tarde
            const grupoTarde = document.createElement('optgroup');
            grupoTarde.label = 'Tarde';
            horariosDisponiveis.tarde.forEach(horario => {
                const opcao = document.createElement('option');
                opcao.value = horario;
                opcao.innerText = horario;
                grupoTarde.appendChild(opcao)
            })
            horarioSelecionado.appendChild(grupoTarde)
        } else {
            const opcao = document.createElement('option');
            opcao.value = '';
            opcao.innerText = 'Selecione uma data primeiro';
            horarioSelecionado.appendChild(opcao)
        }
    })

    // Evento de envio do formulario 
    formulario.addEventListener('submit', (event) => {
        event.preventDefault();

        // validação dos campos obrigatorios 
        const nome = document.getElementById('nome').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const dataForm = document.getElementById('data').value;
        const horaForm = document.getElementById('horario').value;
        const especialidade = document.getElementById('especialidade').value;
        const planoSaude = document.getElementById('plano').value || 'Particular';

        if (!nome || !telefone || !dataForm || !horaForm || !especialidade || !planoSaude) {
            return alert('Por favor, preencha todos os campos obrigatórios')
        }

        // Validação REGEX do formato de telefone
        const telRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    
        if (!telRegex.test(telefone)) {
            return alert('Por favor, insira um número de telefone no formato (XX) XXXXX-XXXX')
        }
        const dataObj = new Date(dataForm);
        const dataFormatada = dataObj.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
        resumoAgendamento.innerHTML = `
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Telefone:</strong> ${telefone}</p>
            <p><strong>Data:</strong> ${dataFormatada}</p>
            <p><strong>Horário:</strong> ${horaForm}</p>
            <p><strong>Especialidade:</strong> ${especialidade}</p>
            <p><strong>Plano de Saúde:</strong> ${planoSaude}</p>
            <p><strong>Código de Confirmação:</strong> ${gerarCodigoConfirmacao()}</p>
        `;

        // Hiden form e mostra config, e dá a opção de um novo agendamento
        formulario.classList.add('hidden');
        divConfirmacao.classList.remove('hidden');
        resumoAgendamento.appendChild(buttonNovoAgendamento)
    });

    // Botao novo agendamento

    buttonNovoAgendamento.addEventListener('click', () => {
        // Reset para limpar o form
        formulario.reset();

        horarioSelecionado.innerHTML = '';
        const opcao = document.createElement('option');
        opcao.value = '';
        opcao.textContent = 'Selecione uma data primeiro';
        horarioSelecionado.appendChild(opcao);

        // Mostrar form e hidden confirmação
        formulario.classList.remove('hidden');
        divConfirmacao.classList.add('hidden');
    });

    // funçao de formatação de telefone ao digitar
    const inputTelefone = document.getElementById('telefone');
    inputTelefone.addEventListener('input', (event) => {
        let val = event.target.value.replace(/\D/g, '');
        if (val.length <= 11) {
            // formata ddd
            val = val.replace(/^(\d{2})(\d)/g, '($1) $2');
            // formata o numero
            val = val.replace(/(\d{5})(\d)/, '$1-$2');
            event.target.value = val;
        }
    });

    // Função que gera o codigo de confirmação
    function gerarCodigoConfirmacao(){
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
});
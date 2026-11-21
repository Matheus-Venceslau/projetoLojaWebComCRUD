const productTable = document.getElementById('productTable');
const productMessage = document.getElementById('productMessage');

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');

const categoryForm = document.getElementById('categoryForm');
const categoryName = document.getElementById('categoryName');
const categoryList = document.getElementById('categoryList');
const categoryMessage = document.getElementById('categoryMessage');

// Formata o preço para reais
function formatPrice(price) {
    return Number(price).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Exibe mensagens na tela
function showMessage(element, message, type = '') {
    element.textContent = message;
    element.className = `message ${type}`;
}

// Busca e exibe os produtos
async function loadProducts(search = '') {
    try {
        productMessage.textContent = '';
        productTable.replaceChildren();

        const url = search
            ? `/produtos?busca=${encodeURIComponent(search)}`
            : '/produtos';

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Não foi possível carregar os produtos.');
        }

        const products = await response.json();

        if (products.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');

            cell.colSpan = 6;
            cell.textContent = 'Nenhum produto encontrado.';

            row.appendChild(cell);
            productTable.appendChild(row);

            return;
        }

        products.forEach(product => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = product.id;

            const nameCell = document.createElement('td');
            nameCell.textContent = product.nome;

            const categoryCell = document.createElement('td');
            categoryCell.textContent = product.categoria || 'Sem categoria';

            const priceCell = document.createElement('td');
            priceCell.textContent = formatPrice(product.preco);

            const stockCell = document.createElement('td');
            stockCell.textContent = product.estoque;

            const actionCell = document.createElement('td');

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.classList.add('deleteButton');

            deleteButton.addEventListener('click', () => {
                deleteProduct(product.id);
            });

            actionCell.appendChild(deleteButton);

            row.append(
                idCell,
                nameCell,
                categoryCell,
                priceCell,
                stockCell,
                actionCell
            );

            productTable.appendChild(row);
        });

    } catch (erro) {
        showMessage(productMessage, erro.message, 'error');
    }
}

// Exclui um produto
async function deleteProduct(id) {
    const confirmed = confirm(
        'Tem certeza que deseja excluir este produto?'
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`/produtos/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const data = await response.json();

            throw new Error(data.erro || 'Erro ao excluir produto.');
        }

        showMessage(
            productMessage,
            'Produto excluído com sucesso!',
            'success'
        );

        loadProducts(searchInput.value.trim());

    } catch (erro) {
        showMessage(productMessage, erro.message, 'error');
    }
}

// Busca produtos pelo formulário
searchForm.addEventListener('submit', event => {
    event.preventDefault();

    const search = searchInput.value.trim();

    loadProducts(search);
});

// Limpa a busca
clearSearch.addEventListener('click', () => {
    searchInput.value = '';

    loadProducts();
});

// Busca e exibe as categorias
async function loadCategories() {
    try {
        categoryList.replaceChildren();

        const response = await fetch('/categorias');

        if (!response.ok) {
            throw new Error('Não foi possível carregar as categorias.');
        }

        const categories = await response.json();

        if (categories.length === 0) {
            const item = document.createElement('li');
            item.textContent = 'Nenhuma categoria cadastrada.';

            categoryList.appendChild(item);
            return;
        }

        categories.forEach(category => {
            const item = document.createElement('li');

            item.textContent = `${category.id} - ${category.nome}`;

            categoryList.appendChild(item);
        });

    } catch (erro) {
        showMessage(categoryMessage, erro.message, 'error');
    }
}

// Cadastra uma categoria
categoryForm.addEventListener('submit', async event => {
    event.preventDefault();

    const nome = categoryName.value.trim();

    if (!nome) {
        showMessage(
            categoryMessage,
            'Informe o nome da categoria.',
            'error'
        );

        return;
    }

    try {
        const response = await fetch('/categorias', {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ nome })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || 'Erro ao cadastrar categoria.');
        }

        showMessage(
            categoryMessage,
            'Categoria cadastrada com sucesso!',
            'success'
        );

        categoryForm.reset();

        loadCategories();

    } catch (erro) {
        showMessage(categoryMessage, erro.message, 'error');
    }
});

// Inicialização da página
loadProducts();
loadCategories();
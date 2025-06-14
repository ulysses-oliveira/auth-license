interface ApiError {
  message: string;
}

interface UsuarioResponse {
  message: string;
  userId: string;
}

async function criarUsuario(dados: {
  name: string;
  email: string;
  password: string;
  role?: string;
}): Promise<UsuarioResponse> {
  try {
    const response = await fetch('http://localhost:7000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.message || 'Erro ao criar usuário');
    }

    return await response.json() as UsuarioResponse;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
}

export async function verificarCodigo(userId: string, code: string) {
  try {
    const response = await fetch('http://localhost:7000/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'ulysses.oliveira2015@gmail.com', code }),
    });

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.message || 'Erro ao verificar código');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao verificar código:', error);
    throw error;
  }
}

async function reenviarCodigo(userId: string) {
  try {
    const response = await fetch('http://localhost:7000/api/auth/resend-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.message || 'Erro ao reenviar código');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao reenviar código:', error);
    throw error;
  }
}

// Exemplo de uso:
async function main() {
  try {
    // Criar usuário
    const novoUsuario = await criarUsuario({
      name: 'João Silva',
      email: 'ulysses.oliveira2015@gmail.com',
      password: 'senha123',
      role: 'USER'
    });

    console.log('Usuário criado com sucesso!');
    console.log('Verifique seu email para o código de verificação.');
    console.log('Para verificar o código, use a função verificarCodigo(novoUsuario.userId, "SEU_CODIGO")');
    console.log('Para reenviar o código, use a função reenviarCodigo(novoUsuario.userId)');

  } catch (error) {
    console.error('Erro:', error);
  }
}

main();

export {};


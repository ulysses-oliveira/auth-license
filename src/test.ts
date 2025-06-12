// Exemplo de uso das rotas usando fetch
import { UserData } from './types/auth';

interface UserResponse {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

// Criar um novo usuário
const createUser = async (userData: UserData): Promise<UserResponse> => {
  try {
    console.log('Enviando dados:', userData); // Debug

    const response = await fetch('http://localhost:7000/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

// Exemplo de uso
const novoUsuario: UserData = {
  name: 'João Silva',
  email: 'ulysses.oliveira2015@gmail.com',
  password: 'Senha123',
  role: 'USER'
};

// Criar usuário
createUser(novoUsuario)
  .then(user => console.log('Usuário criado:', user))
  .catch(error => console.error('Erro:', error));

// Buscar usuário por ID
const getUserById = async (userId: string): Promise<UserResponse> => {
  try {
    const response = await fetch(`http://localhost:7000/v1/users/${userId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
};

// getUserById('1')

// getUserById('1')
//   .then(user => console.log('Usuário encontrado:', user))
//   .catch(error => console.error('Erro:', error));

// // Atualizar usuário
// const updateUser = async (userId: string, userData: UserData): Promise<UserResponse> => {
//   try {
//     const response = await fetch(`http://localhost:7000/api/v1/users/${userId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(userData),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Erro ao atualizar usuário:', error);
//     throw error;
//   }
// };

// // Deletar usuário
// const deleteUser = async (userId: string): Promise<UserResponse> => {
//   try {
//       const response = await fetch(`http://localhost:7000/api/v1/users/${userId}`, {
//       method: 'DELETE',
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Erro ao deletar usuário:', error);
//     throw error;
//   }
// };


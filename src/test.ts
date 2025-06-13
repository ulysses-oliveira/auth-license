// Exemplo de uso das rotas usando fetch
interface UserData {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
}

interface UserResponse {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  name: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

import { UserService } from './services/userService';
import { initModels } from './models';

async function createUser() {
  try {
    // Inicializar modelos e sincronizar banco de dados
    await initModels();

    const userService = new UserService();
    const userData = {
      name: 'João Silva',
      email: 'ulysses.oliveira2015@gmail.com',
      password: 'Senha123',
      role: 'USER' as const
    };

    console.log('Enviando dados:', userData);
    const user = await userService.createUser(userData);
    console.log('Usuário criado:', user);
  } catch (error) {
    console.error('Erro ao criar usuário, test.ts:', error);
    throw error;
  }
}

createUser().catch((error) => {
  console.error('Erro:', error);
});

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


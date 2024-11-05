import { Injectable, signal, WritableSignal } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

const DB_USERS = 'espacio_DuocUC';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  active: number;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private users: WritableSignal<User[]> = signal<User[]>([]);

  num: number = 1;

  constructor() { }

  // Inicializa la base de datos y crea la tabla si no existe
  async initializePlugin() {
    this.db = await this.sqlite.createConnection(
      DB_USERS,
      false,
      'no-encryption',
      1,
      false
    );

    await this.db.open();
    const queryUsuarios = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      password TEXT,
      active INTEGER,
      isAdmin INTEGER DEFAULT 0
    );
  `;

    const queryReservas = `
      CREATE TABLE IF NOT EXISTS reservas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        fecha TEXT,
        sala TEXT,
        estado INTEGER,
        FOREIGN KEY (userId) REFERENCES usuarios(id) ON DELETE CASCADE
      );
    `;

      // Ejecuta las consultas para crear las tablas
    await this.db.execute(queryUsuarios);
    await this.db.execute(queryReservas);


    // Verifica si existe un usuario admin y, si no, lo crea
    const result = await this.db.query('SELECT * FROM usuarios WHERE isAdmin = 1;');
    if (!result.values || result.values.length === 0) {
      await this.addUser('admin', 'admin@example.com', 'admin1234', 1, 1); // Crea usuario admin si no existe
      localStorage.setItem('userId', this.num.toString());
    }

     

    await this.loadUsers(); // Carga los usuarios después de inicializar
    return true;
  }

  // Obtiene el listado de usuarios en formato de señal reactiva
  getUser() {
    return this.users;
  }

  // Carga los usuarios desde la base de datos y actualiza la señal
  async loadUsers() {
    const result = await this.db.query('SELECT * FROM usuarios;');
    this.users.set(result.values as User[] || []);
  }

  // Crear un nuevo usuario
  async addUser(name: string, email: string, password: string, active: number = 1, isAdmin: number = 0) {
    const query = `INSERT INTO usuarios (name, email, password, active, isAdmin) VALUES (?, ?, ?, ?, ?);`;
    const values = [name, email, password, active, isAdmin];
    await this.db.run(query, values);
    await this.loadUsers();
  }

  // Leer un usuario específico por su ID
  async getUserById(id: number): Promise<User | null> {
    const result = await this.db.query('SELECT * FROM usuarios WHERE id = ?;', [id]);
    return result.values?.[0] as User || null;
  }

  // Actualizar un usuario existente
  async updateUser(id: number, name: string, email: string, password: string, active: number) {
    const query = `UPDATE usuarios SET name = ?, email = ?, password = ?, active = ? WHERE id = ?;`;
    const values = [name, email, password, active, id];
    await this.db.run(query, values);
    await this.loadUsers(); // Recarga los usuarios después de actualizar uno
  }

  // Eliminar un usuario por su ID
  async deleteUser(id: number) {
    const query = `DELETE FROM usuarios WHERE id = ?;`;
    await this.db.run(query, [id]);
    await this.loadUsers(); // Recarga los usuarios después de eliminar uno
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    if (!this.db) {
      await this.initializePlugin();
    }
  
    const result = await this.db.query(
      'SELECT * FROM usuarios WHERE email = ? AND password = ?',
      [email, password]
    );
  
    return result.values && result.values.length > 0 ? result.values[0] as User : null;
  }

  // Método para obtener reservas por userId
async getReservasByUserId(userId: number): Promise<any[]> {
  const result = await this.db.query('SELECT * FROM reservas WHERE userId = ?;', [userId]);
  return result.values || [];
}

// Método para cancelar una reserva
async cancelarReserva(reservaId: number): Promise<void> {
  const query = `UPDATE reservas SET estado = 3 WHERE id = ?;`; // Cambia el estado a 3
  await this.db.run(query, [reservaId]);
}

// Método para confirmar una reserva
async confirmarReserva(reservaId: number): Promise<void> {
  const query = `UPDATE reservas SET estado = 2 WHERE id = ?;`; // Cambia el estado a 2 (confirmado)
  await this.db.run(query, [reservaId]);
}

// Método para añadir una reserva
async addReserva(fecha: string, sala: number, estado: number, userId: number) {
  const query = `INSERT INTO reservas (fecha, sala, estado, userId) VALUES (?, ?, ?, ?);`;
  const values = [fecha, sala, estado, userId];
  await this.db.run(query, values);
}

async eliminarTodasLasReservas(): Promise<void> {
  const query = `DELETE FROM reservas;`;
  try {
    await this.db.run(query);
    console.log('Todas las reservas han sido eliminadas.');
  } catch (error) {
    console.error('Error al eliminar todas las reservas:', error);
    throw error;
  }
}

  
}



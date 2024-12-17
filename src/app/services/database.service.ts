import { Injectable, signal, WritableSignal } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

const DB_USERS = 'espacio_DuocUC';

export interface User {
  id: number;
  name: string;
  rut: string;
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

  numAdmin: number = 1;
  numUser: number = 0;

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
      rut TEXT,
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
        sala NUMBER,
        estado INTEGER,
        FOREIGN KEY (userId) REFERENCES usuarios(id) ON DELETE CASCADE
      );
    `;

    const queryPenalizacion = `
      CREATE TABLE IF NOT EXISTS penalizacion (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        fecha TEXT,
        descripcion TEXT,
        FOREIGN KEY (userId) REFERENCES usuarios(id) ON DELETE CASCADE);`
    ;

    const querySalasOcupadas = `
      CREATE TABLE IF NOT EXISTS salas_ocupadas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha TEXT,
      sala NUMBER,
      hora TEXT);`
    ;

      // Ejecuta las consultas para crear las tablas
    await this.db.execute(queryUsuarios);
    await this.db.execute(queryReservas);
    await this.db.execute(queryPenalizacion);
    await this.db.execute(querySalasOcupadas);


    // Verifica si existe un usuario admin y, si no, lo crea
    const result = await this.db.query('SELECT * FROM usuarios WHERE isAdmin = 1;');
    if (!result.values || result.values.length === 0) {
      await this.addUser('admin', '12345678-9', 'admin@example.com', 'admin1234', 1, 1); // Crea usuario admin si no existe
      
    }

    const resultUser = await this.db.query('SELECT * FROM usuarios WHERE isAdmin = 0;');
    if (!resultUser.values || resultUser.values.length === 0){
      await this.addUser('user', '23456789-0', 'user@example.com', 'user1234', 1, 0);
      
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
  async addUser(name: string, rut: string, email: string, password: string, active: number = 1, isAdmin: number = 0) {
    const query = `INSERT INTO usuarios (name, rut, email, password, active, isAdmin) VALUES (?, ?, ?, ?, ?, ?);`;
    const values = [name, rut, email, password, active, isAdmin];
    await this.db.run(query, values);
    await this.loadUsers();
  }

  // Leer un usuario específico por su ID
  async getUserById(id: number): Promise<User | null> {
    const result = await this.db.query('SELECT * FROM usuarios WHERE id = ?;', [id]);
    return result.values?.[0] as User || null;
  }

  // Leer un usuario específico por su Rut
  async getUserByRut(rut: string): Promise<User | null> {
    const result = await this.db.query('SELECT * FROM usuarios WHERE rut = ?;', [rut]);
    return result.values?.[0] as User || null;
  }

  // Actualizar un usuario existente
  async updateUser(id: number, name: string, rut: string, email: string, password: string, active: number) {
    const query = `UPDATE usuarios SET name = ?, rut = ?, email = ?, password = ?, active = ? WHERE id = ?;`;
    const values = [name, rut, email, password, active, id];
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
  const query2 = `DELETE FROM salas_ocupadas;`
  try {
    await this.db.run(query);
    await this.db.run(query2);
    console.log('Todas las reservas han sido eliminadas.');
  } catch (error) {
    console.error('Error al eliminar todas las reservas:', error);
    throw error;
  }
}

async reservas(): Promise<void>{
  const query = `SELECT * FROM RESERVAS;`
  try {
    await this.db.run(query);
    console.log("RESERVAS OBTENIDAS")
  } catch (error) {
    console.error("ERROR AL OBTENER RESERVAS");
    throw error;
  }
}

// Método para agregar una sala ocupada
async addSalaOcupada(fecha: string, sala: number, hora: string): Promise<void> {
  const query = `INSERT INTO salas_ocupadas (fecha, sala, hora) VALUES (?, ?, ?);`;
  const values = [fecha, sala, hora];
  await this.db.run(query, values);
}

async obtenerSalaOcupada(fecha: string, sala: number, hora: string){
  // Asumiendo que tienes las variables: fecha, salaId, hora
  const result = await this.db.query('SELECT * FROM salas_ocupadas WHERE fecha = ? AND sala = ? AND hora = ?', [fecha, sala, hora]);
  const resultados = result.values || [];

  if (resultados.length === 0) {
    console.log("No se encontraron resultados.");
    return false;
    // Lógica adicional cuando no hay resultados
  } else {
    console.log("Resultados encontrados:", resultados);
    return true;
    // Lógica para cuando hay resultados
  }
}

async addPenalizacion(fecha: string, descripcion: string, userId: number) {
  const query = `INSERT INTO penalizacion (fecha, descripcion, userId) VALUES (?, ?, ?);`;
  const values = [fecha, descripcion, userId];
  await this.db.run(query, values);
}

async getPenalizacionesByUserId(userId: number): Promise<any[]> {
  const result = await this.db.query('SELECT * FROM penalizacion WHERE userId = ?;', [userId]);
  console.log(result);
  return result.values || [];
}

}



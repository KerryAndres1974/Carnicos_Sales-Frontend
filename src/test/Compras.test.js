import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Compras from '../paginas/Compras.jsx'; // Suponiendo que tu componente se llama Compras
import '@testing-library/jest-dom';

describe('Pruebas de lógica para Compras', () => {
  test('actualiza el valor de una casilla en la fila', () => {
    const { result } = render(<Compras />); // Renderizar componente
    const fila = 0; // Fila inicial
    const campo = 'nombreproducto'; // Campo específico

    act(() => {
      result.current.valorCasilla({ target: { value: 'Nuevo Producto' } }, fila, campo);
    });

    // Validar que el estado se actualizó correctamente
    expect(result.current.filas[fila][campo]).toBe('Nuevo Producto');
  });

  test('agrega una nueva fila al estado de filas', () => {
    const { result } = render(<Compras />); // Renderizar componente
    const fila = 0;

    act(() => {
      result.current.agregarFila(fila);
    });

    // Validar que se agregó una nueva fila con los valores iniciales
    expect(result.current.filas).toHaveLength(2);
    expect(result.current.filas[1]).toMatchObject({
      cantidadxlibra: '1',
      precioxlibra: '',
      nombreproducto: '',
      tipoproducto: '',
      idproveedor: '',
      preciocompra: '',
      boton: true,
    });
  });

  test('quita una fila del estado de filas', () => {
    const { result } = render(<Compras />); // Renderizar componente
    const filaInicialLength = result.current.filas.length;

    act(() => {
      result.current.quitarFila(0);
    });

    // Validar que se quitó una fila si la longitud inicial era mayor a 1
    if (filaInicialLength > 1) {
      expect(result.current.filas).toHaveLength(filaInicialLength - 1);
    } else {
      expect(result.current.filas[0].idProducto).toBe('');
    }
  });

  test('envía datos al backend y reinicia las filas', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(),
      })
    );

    const { result } = render(<Compras />); // Renderizar componente
    const filasInicial = [{ cantidadxlibra: '1', precioxlibra: '', nombreproducto: '', tipoproducto: '', idproveedor: '', preciocompra: '' }];

    await act(async () => {
      await result.current.enviarDatos({ preventDefault: () => {} });
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/new-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filasInicial),
    });
    expect(result.current.filas).toEqual(filasInicial); // Validar que se reiniciaron las filas
  });
});

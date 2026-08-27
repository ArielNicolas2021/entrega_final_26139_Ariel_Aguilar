package com.talentoTech.gestionProductos.exceptions;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import tools.jackson.databind.exc.InvalidFormatException;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {

    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(ex.getMessage());
  }

  // Manejador de excepciones para errores de deserialización
  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<?> handleDeserializationError(
      HttpMessageNotReadableException ex) {

    String mensaje = "El formato de los datos enviados no es válido";

    Throwable cause = ex.getCause();

    if (cause instanceof InvalidFormatException invalidFormatException) {

      String campo = invalidFormatException
          .getPath()
          .get(0)
          .getPropertyName();

      mensaje = "El campo '" + campo + "' tiene un formato inválido";
    }

    return ResponseEntity
        .badRequest()
        .body(Map.of("error", mensaje));
  }

  // Manejador de excepciones para errores de validación
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<?> handleValidationErrors(
      MethodArgumentNotValidException ex) {

    Map<String, String> errores = new HashMap<>();

    ex.getBindingResult()
        .getFieldErrors()
        .forEach(error -> errores.put(
            error.getField(),
            error.getDefaultMessage()));

    return ResponseEntity
        .badRequest()
        .body(errores);
  }
}
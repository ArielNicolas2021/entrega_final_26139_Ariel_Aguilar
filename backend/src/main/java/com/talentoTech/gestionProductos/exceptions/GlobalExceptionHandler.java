package com.talentoTech.gestionProductos.exceptions;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<?> handleRunTimeException(RuntimeException ex) {
    Map<String, Object> errorResponse = new LinkedHashMap<>();
    errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
    errorResponse.put("mensaje", ex.getMessage());

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<?> handleIllegalArgumentException(IllegalArgumentException ex) {
    Map<String, Object> errorResponse = new LinkedHashMap<>();
    errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
    errorResponse.put("mensaje", ex.getMessage());

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }

  @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
  public ResponseEntity<?> handleSQLIntegrityConstraintViolationException(SQLIntegrityConstraintViolationException ex) {
    Map<String, Object> errorResponse = new LinkedHashMap<>();

    errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
    errorResponse.put("mensaje", ex.getMessage());

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
    Map<String, Object> errorResponse = new LinkedHashMap<>();

    errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
    errorResponse.put("mensaje", ex.getMessage());

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }
}
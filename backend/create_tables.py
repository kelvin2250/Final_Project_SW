#!/usr/bin/env python3
"""
Script to create database tables
"""
from app.db.session import engine
from app.db.base import Base

def create_tables():
    """Create all tables in the database"""
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

if __name__ == "__main__":
    create_tables()

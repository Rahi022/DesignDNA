"""
Promote a registered user to the "admin" role.

Usage (run from inside backend/, with the venv active):

    python make_admin.py user@example.com

You must register the account through the normal /register flow
first — this script only changes the role of an existing user.
"""

import sys

from database import SessionLocal
from models import User


def main():

    if len(sys.argv) != 2:
        print("Usage: python make_admin.py <email>")
        sys.exit(1)

    email = sys.argv[1].strip().lower()

    db = SessionLocal()

    try:
        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if not user:
            print(f"No user found with email '{email}'.")
            print("Register the account first, then run this again.")
            sys.exit(1)

        if user.role == "admin":
            print(f"'{email}' is already an admin.")
            return

        user.role = "admin"

        db.commit()

        print(f"'{email}' is now an admin. Log out and log back in for it to take effect.")

    finally:
        db.close()


if __name__ == "__main__":
    main()

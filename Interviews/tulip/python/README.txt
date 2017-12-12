You will need  Python 2.7, pip, and virtualenv.

If you don't have pip and virtualenv installed, run:

    sudo easy_install pip
    sudo pip install virtualenv

Then, cd to this directory and create a virtualenv:

    virtualenv .virtualenv

If you default python is not Python 2.7 (for example, if your default python
is Python 3 and you have Python 2.7 installed as python2), you should set
up the virtualenv with Python 2.7: `virtualenv -p python2 .virtualenv`).

Then, active your virtualenv:

    source .virtualenv/bin/activate

Now, you can install the project's dependencies:

    pip install -r requirements.txt

And start up the test server with:

    python main.py

If the server starts up without printing any errors, open index.html (from the
root of the test-script folder) in Google Chrome to finish the check.

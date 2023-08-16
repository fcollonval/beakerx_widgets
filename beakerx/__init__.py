# Copyright 2017 TWO SIGMA OPEN SOURCE, LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#        http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

try:
    from ._version import __version__
except ImportError:
    # Fallback when using the package in dev mode without installing
    # in editable mode with pip. It is highly recommended to install
    # the package from a stable release or in editable mode: https://pip.pypa.io/en/stable/topics/local-project-installs/#editable-installs
    import warnings
    warnings.warn("Importing 'beakerx' outside a proper installation.")
    __version__ = "dev"
version_info = __version__.split(".")

from .commands import parse_widgets
from .forms import *
from .handlers import setup_handlers
from .magics import *
from .outputs import *
from .plots import *
from .spark import *
from .object import beakerx

from beakerx_base import *

try:
    from beakerx_tabledisplay.tabledisplay import *
    from beakerx_tabledisplay.tableitems import *
except ModuleNotFoundError:
    pass

def _jupyter_labextension_paths():
    return [{
        'src': 'labextension',
        'dest': '@beakerx/beakerx-widgets',
    }]

def _jupyter_server_extension_points():
    return [dict(module="beakerx")]

def _load_jupyter_server_extension(serverapp):
    """Registers the API handler to receive HTTP requests from the frontend extension.

    Parameters
    ----------
    lab_app: jupyterlab.labapp.LabApp
        JupyterLab application instance
    """
    url_path = "beakerx"
    setup_handlers(serverapp, url_path)
    serverapp.log.info("Registered beakerx server extension at URL path /{}".format(url_path))

def run():
    try:
        parse_widgets()
    except KeyboardInterrupt:
        return 130
    return 0